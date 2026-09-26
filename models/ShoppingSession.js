const mongoose = require("mongoose");

const shoppingSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    trolleyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trolley",
      required: true
    },

    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "CANCELLED"],
      default: "ACTIVE"
    },

    startedAt: {
      type: Date,
      default: Date.now
    },

    completedAt: {
      type: Date,
      default: null
    },

    totalAmount: {
      type: Number,
      min: 0,
      default: 0
    },

    totalItems: {
      type: Number,
      min: 0,
      default: 0
    },

    currency: {
      type: String,
      default: "INR"
    }
  },
  {
    timestamps: true
  }
);

const ShoppingSession = mongoose.model(
  "ShoppingSession",
  shoppingSessionSchema
);

module.exports = ShoppingSession;