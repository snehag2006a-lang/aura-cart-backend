const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    expectedWeight: {
      type: Number,
      required: true,
      min: 0
    },

    weightTolerance: {
      type: Number,
      required: true,
      min: 0
    },

    barcode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },

    inventory: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    promotion: {
      type: String,
      default: null,
      trim: true
    },

    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW"
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;