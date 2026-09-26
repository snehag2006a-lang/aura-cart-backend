const Product = require("../models/Product");

const checkConsistency = async (
  productId,
  actualWeight,
  productVerificationStatus
) => {
  try {
    // Find product
    const product = await Product.findById(productId);

    // Product not found
    if (!product) {
      return {
        status: "REVIEW_REQUIRED",
        reason: "UNKNOWN_PRODUCT"
      };
    }

    // Product verification failed
    if (productVerificationStatus !== "VERIFIED") {
      return {
        status: "REVIEW_REQUIRED",
        reason: "PRODUCT_VERIFICATION_FAILED"
      };
    }

    // Expected weight details
    const expectedWeight = product.expectedWeight;
    const tolerance = product.weightTolerance;

    const minimumWeight = expectedWeight - tolerance;
    const maximumWeight = expectedWeight + tolerance;

    // Check weight
    const weightMatched =
      actualWeight >= minimumWeight &&
      actualWeight <= maximumWeight;

    // Both product and weight must match
    if (weightMatched) {
      return {
        status: "VERIFIED",
        reason: "PRODUCT_AND_WEIGHT_MATCH",
        productVerification: "VERIFIED",
        weightVerification: "VERIFIED",
        expectedWeight,
        actualWeight,
        tolerance
      };
    }

    // Weight mismatch
    return {
      status: "REVIEW_REQUIRED",
      reason: "WEIGHT_MISMATCH",
      productVerification: "VERIFIED",
      weightVerification: "REVIEW_REQUIRED",
      expectedWeight,
      actualWeight,
      tolerance,
      allowedRange: {
        minimum: minimumWeight,
        maximum: maximumWeight
      }
    };
  } catch (error) {
    return {
      status: "REVIEW_REQUIRED",
      reason: "CONSISTENCY_CHECK_ERROR",
      error: error.message
    };
  }
};

module.exports = {
  checkConsistency
};