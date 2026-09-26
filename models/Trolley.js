const mongoose = require("mongoose");

const trolleySchema = new mongoose.Schema(
  {
    trolleyId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "IN_USE", "MAINTENANCE", "OFFLINE"],
      default: "AVAILABLE"
    },

    location: {
      type: String,
      default: "Store"
    },

    batteryLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    },

    hardwareStatus: {
      camera: {
        type: Boolean,
        default: true
      },

      weightSensor: {
        type: Boolean,
        default: true
      },

      barcodeScanner: {
        type: Boolean,
        default: true
      },

      display: {
        type: Boolean,
        default: true
      },

      palmScanner: {
        type: Boolean,
        default: true
      }
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

const Trolley = mongoose.model("Trolley", trolleySchema);

module.exports = Trolley;