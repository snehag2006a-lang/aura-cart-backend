const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: [
        "SESSION_CREATED",
        "ITEM_ADDED",
        "ITEM_REMOVED",
        "ITEM_VERIFIED",
        "VERIFICATION_FAILED",
        "WEIGHT_MISMATCH",
        "REVIEW_REQUIRED",
        "BILL_GENERATED",
        "PAYMENT_STARTED",
        "PAYMENT_SUCCESS",
        "PAYMENT_FAILED",
        "INVENTORY_UPDATED",
        "TRANSACTION_COMPLETED",
        "SESSION_COMPLETED",
        "TROLLEY_RELEASED"
      ]
    },

    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShoppingSession",
      default: null
    },

    trolleyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trolley",
      default: null
    },

    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      default: null
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null
    },

    message: {
      type: String,
      required: true
    },

    source: {
      type: String,
      enum: [
        "CART",
        "AI",
        "WEIGHT_SENSOR",
        "CONSISTENCY_ENGINE",
        "BILLING",
        "PAYMENT",
        "INVENTORY",
        "SYSTEM"
      ],
      default: "SYSTEM"
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "AuditLog",
  auditLogSchema
);