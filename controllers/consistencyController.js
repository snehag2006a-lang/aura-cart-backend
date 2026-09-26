const { checkConsistency } = require("../services/consistencyService");

const checkConsistencyController = async (req, res) => {
  try {
    const {
      productId,
      actualWeight,
      productVerificationStatus
    } = req.body;

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

    if (!productVerificationStatus) {
      return res.status(400).json({
        success: false,
        message: "Product verification status is required"
      });
    }

    // Run consistency check
    const result = await checkConsistency(
      productId,
      actualWeight,
      productVerificationStatus
    );

    res.status(200).json({
      success: true,
      consistencyCheck: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Consistency check failed",
      error: error.message
    });
  }
};

module.exports = {
  checkConsistencyController
};