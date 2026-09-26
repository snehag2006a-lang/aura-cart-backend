const Product = require("../models/Product");
const ShoppingSession = require("../models/ShoppingSession");
const CartItem = require("../models/CartItem");

const recognizeProduct = async (req, res) => {
  try {
    const { sku, productName, confidence } = req.body;

    // --------------------------------------------------
    // 1. Validate AI input
    // --------------------------------------------------

    if (!sku) {
      return res.status(400).json({
        success: false,
        message: "Product SKU is required"
      });
    }

    if (confidence === undefined || confidence === null) {
      return res.status(400).json({
        success: false,
        message: "AI confidence is required"
      });
    }

    // --------------------------------------------------
    // 2. Find product in Product Database
    // --------------------------------------------------

    const product = await Product.findOne({
      sku: sku,
      isActive: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "AI recognized product was not found in product database",
        detectedProduct: {
          sku,
          productName,
          confidence
        }
      });
    }

    // --------------------------------------------------
    // 3. Find the latest ACTIVE shopping session
    // --------------------------------------------------

    const session = await ShoppingSession.findOne({
      status: "ACTIVE"
    }).sort({
      createdAt: -1
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "No active shopping session found"
      });
    }

    // --------------------------------------------------
    // 4. Check whether product already exists in cart
    // --------------------------------------------------

    let cartItem = await CartItem.findOne({
      sessionId: session._id,
      productId: product._id
    });

    // --------------------------------------------------
    // 5. Add new product OR increase quantity
    // --------------------------------------------------

    if (cartItem) {
      cartItem.quantity += 1;

      cartItem.totalPrice =
        cartItem.quantity * cartItem.unitPrice;

      // Product needs verification again
      cartItem.verificationStatus = "PENDING";

      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        sessionId: session._id,
        productId: product._id,
        quantity: 1,
        unitPrice: product.price,
        totalPrice: product.price,
        verificationStatus: "PENDING"
      });
    }

    // --------------------------------------------------
    // 6. Recalculate shopping session totals
    // --------------------------------------------------

    const cartItems = await CartItem.find({
      sessionId: session._id
    });

    session.totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

    session.totalAmount = cartItems.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    await session.save();

    // --------------------------------------------------
    // 7. Return AI + Cart + Session information
    // --------------------------------------------------

    res.status(200).json({
      success: true,

      message: "AI product recognized and added to active cart successfully",

      recognition: {
        sku: product.sku,
        productName: product.name,
        category: product.category,
        price: product.price,
        expectedWeight: product.expectedWeight,
        weightTolerance: product.weightTolerance,
        confidence: confidence,
        recognitionStatus: "PRODUCT_DETECTED"
      },

      cartItem: {
        cartItemId: cartItem._id,
        productId: product._id,
        sku: product.sku,
        productName: product.name,
        quantity: cartItem.quantity,
        unitPrice: cartItem.unitPrice,
        totalPrice: cartItem.totalPrice,
        verificationStatus: cartItem.verificationStatus
      },

      shoppingSession: {
        sessionId: session.sessionId,
        trolleyId: session.trolleyId,
        status: session.status
      },

      sessionTotals: {
        totalItems: session.totalItems,
        totalAmount: session.totalAmount,
        currency: session.currency
      }
    });

  } catch (error) {
    console.error("AI recognition error:", error);

    res.status(500).json({
      success: false,
      message: "AI product recognition failed",
      error: error.message
    });
  }
};

module.exports = {
  recognizeProduct
};