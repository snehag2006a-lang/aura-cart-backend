const { verifyWeight } = require("../services/weightVerificationService");

const verifyWeightController = async (req, res) => {
  try {
    const { productId, actualWeight } = req.body;

    // Check required fields
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    if (actualWeight === undefined || actualWeight === null) {
      return res.status(400).json({
        success: false,
        message: "Actual weight is required"
      });
    }

    // Verify weight
    const result = await verifyWeight(productId, actualWeight);

    res.status(200).json({
      success: true,
      weightVerification: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Weight verification failed",
      error: error.message
    });
  }
};

module.exports = {
  verifyWeightController
};