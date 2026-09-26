const {
  verifyCartItem
} = require("../services/cartVerificationService");

const verifyCartItemController = async (req, res) => {
  try {
    const { cartItemId, actualWeight } = req.body;

    // Check cart item ID
    if (!cartItemId) {
      return res.status(400).json({
        success: false,
        message: "Cart item ID is required"
      });
    }

    // Check actual weight
    if (actualWeight === undefined || actualWeight === null) {
      return res.status(400).json({
        success: false,
        message: "Actual weight is required"
      });
    }

    // Verify cart item
    const result = await verifyCartItem(
      cartItemId,
      actualWeight
    );

    res.status(200).json({
      success: true,
      cartVerification: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cart verification failed",
      error: error.message
    });
  }
};

module.exports = {
  verifyCartItemController
};