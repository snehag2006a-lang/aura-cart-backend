const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShoppingSession",
    required: true
  },

  trolleyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trolley",
    required: true
  },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },

      name: {
        type: String,
        required: true
      },

      quantity: {
        type: Number,
        required: true,
        min: 1
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
      }
    }
  ],

  totalItems: {
    type: Number,
    required: true,
    min: 0
  },

  subtotal: {
    type: Number,
    required: true,
    min: 0
  },

  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },

  paymentStatus: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING"
  },

  transactionStatus: {
    type: String,
    enum: ["PENDING", "COMPLETED", "CANCELLED"],
    default: "PENDING"
  },

  currency: {
    type: String,
    default: "INR"
  }
}, {
  timestamps: true
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
