const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
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

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null
    },

    alertType: {
      type: String,
      enum: [
        "PRODUCT_MISMATCH",
        "WEIGHT_MISMATCH",
        "UNKNOWN_PRODUCT",
        "DUPLICATE_ITEM",
        "PRODUCT_REMOVED",
        "UNVERIFIED_ITEM",
        "BILLING_ANOMALY"
      ],
      required: true
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM"
    },

    message: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["OPEN", "REVIEWED", "RESOLVED"],
      default: "OPEN"
    },

    source: {
      type: String,
      enum: [
        "AI",
        "WEIGHT_SENSOR",
        "BARCODE",
        "CONSISTENCY_ENGINE",
        "CART",
        "SYSTEM"
      ],
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Alert = mongoose.model("Alert", alertSchema);

module.exports = Alert;