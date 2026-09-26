const { verifyProduct } = require("../services/verificationService");

const verifyProductController = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    const result = await verifyProduct(productId);

    res.status(200).json({
      success: true,
      verification: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product verification failed",
      error: error.message
    });
  }
};

module.exports = {
  verifyProductController
};