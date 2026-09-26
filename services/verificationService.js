const Product = require("../models/Product");

const verifyProduct = async (productId) => {
  try {
    const product = await Product.findById(productId);

    // Product does not exist
    if (!product) {
      return {
        status: "REVIEW_REQUIRED",
        reason: "UNKNOWN_PRODUCT"
      };
    }

    // Product exists but is inactive
    if (!product.isActive) {
      return {
        status: "REVIEW_REQUIRED",
        reason: "PRODUCT_INACTIVE"
      };
    }

    // Product is valid
    return {
      status: "VERIFIED",
      reason: "PRODUCT_MATCH",
      product
    };
  } catch (error) {
    return {
      status: "REVIEW_REQUIRED",
      reason: "VERIFICATION_ERROR",
      error: error.message
    };
  }
};

module.exports = {
  verifyProduct
};