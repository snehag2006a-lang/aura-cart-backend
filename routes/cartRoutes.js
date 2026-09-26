const express = require("express");

const {
  addToCart,
  getCartItems,
  removeFromCart
} = require("../controllers/cartController");

const router = express.Router();

// Add product to cart
router.post("/", addToCart);

// Get cart items
router.get("/:sessionId", getCartItems);

// Remove product from cart
router.delete("/:cartItemId", removeFromCart);

module.exports = router;
