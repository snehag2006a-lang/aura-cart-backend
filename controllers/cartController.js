const CartItem = require("../models/CartItem");
const ShoppingSession = require("../models/ShoppingSession");
const Product = require("../models/Product");

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const { sessionId, productId, quantity = 1 } = req.body;

    // Check shopping session
    const session = await ShoppingSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Shopping session not found"
      });
    }

    if (session.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Shopping session is not active"
      });
    }

    // Check product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: "Product is not active"
      });
    }

    // Check if product already exists in cart
    let cartItem = await CartItem.findOne({
      sessionId,
      productId
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.totalPrice = cartItem.quantity * cartItem.unitPrice;
      cartItem.verificationStatus = "PENDING";

      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        sessionId,
        productId,
        quantity,
        unitPrice: product.price,
        totalPrice: quantity * product.price,
        verificationStatus: "PENDING"
      });
    }

    // Update session totals
    const cartItems = await CartItem.find({ sessionId });

    session.totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

    session.totalAmount = cartItems.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    await session.save();

    res.status(201).json({
      success: true,
      message: "Product added to cart successfully",
      cartItem,
      sessionTotals: {
        totalItems: session.totalItems,
        totalAmount: session.totalAmount
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to add product to cart",
      error: error.message
    });
  }
};

// Get cart items for a shopping session
const getCartItems = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const cartItems = await CartItem.find({ sessionId })
      .populate("productId");

    res.status(200).json({
      success: true,
      count: cartItems.length,
      cartItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart items",
      error: error.message
    });
  }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;

    // Find cart item
    const cartItem = await CartItem.findById(cartItemId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found"
      });
    }

    // Find shopping session
    const session = await ShoppingSession.findById(
      cartItem.sessionId
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Shopping session not found"
      });
    }

    // Remove cart item
    await CartItem.findByIdAndDelete(cartItemId);

    // Recalculate session totals
    const remainingCartItems = await CartItem.find({
      sessionId: session._id
    });

    session.totalItems = remainingCartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

    session.totalAmount = remainingCartItems.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    await session.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      sessionTotals: {
        totalItems: session.totalItems,
        totalAmount: session.totalAmount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove product from cart",
      error: error.message
    });
  }
};

module.exports = {
  addToCart,
  getCartItems,
  removeFromCart
};
