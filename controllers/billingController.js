const { generateBill } = require("../services/billingService");

const generateBillController = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Check session ID
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required"
      });
    }

    // Generate bill
    const transaction = await generateBill(sessionId);

    res.status(201).json({
      success: true,
      message: "Bill generated successfully",
      transaction
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to generate bill",
      error: error.message
    });
  }
};

module.exports = {
  generateBillController
};
