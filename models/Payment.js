const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: true
  },

  amount: {
    type: Number,
    required: true,
    min: 0
  },

  method: {
    type: String,
    enum: ["PALM", "UPI", "CARD", "CASH", "SIMULATED"],
    required: true
  },

  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING"
  },

  reference: {
    type: String,
    default: null,
    trim: true
  }
}, {
  timestamps: true
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
