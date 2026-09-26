const { processPayment } = require("../services/paymentService");

const processPaymentController = async (req, res) => {
  try {
    const { transactionId, method } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required"
      });
    }

    if (!method) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required"
      });
    }

    const result = await processPayment(
      transactionId,
      method
    );

    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      payment: result.payment,
      transaction: result.transaction
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Payment failed",
      error: error.message
    });
  }
};

module.exports = {
  processPaymentController
};
