const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShoppingSession",
      required: true
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },

    verificationStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REVIEW_REQUIRED"],
      default: "PENDING"
    }
  },
  {
    timestamps: true
  }
);

const CartItem = mongoose.model("CartItem", cartItemSchema);

module.exports = CartItem;