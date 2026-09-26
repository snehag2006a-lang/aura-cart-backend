const Product = require("../models/Product");

const verifyWeight = async (
  productId,
  actualWeight,
  quantity = 1
) => {
  try {
    // 1. Validate quantity
    if (!quantity || quantity < 1) {
      return {
        status: "REVIEW_REQUIRED",
        reason: "INVALID_QUANTITY"
      };
    }

    // 2. Validate actual weight
    if (
      actualWeight === undefined ||
      actualWeight === null ||
      isNaN(actualWeight) ||
      actualWeight < 0
    ) {
      return {
        status: "REVIEW_REQUIRED",
        reason: "INVALID_ACTUAL_WEIGHT"
      };
    }

    // Convert values to numbers
    actualWeight = Number(actualWeight);
    quantity = Number(quantity);

    // 3. Find product
    const product = await Product.findById(productId);

    // 4. Product not found
    if (!product) {
      return {
        status: "REVIEW_REQUIRED",
        reason: "UNKNOWN_PRODUCT"
      };
    }

    // 5. Get product weight information
    const unitExpectedWeight = Number(product.expectedWeight);
    const unitTolerance = Number(product.weightTolerance);

    // 6. Validate product weight data
    if (
      isNaN(unitExpectedWeight) ||
      unitExpectedWeight <= 0 ||
      isNaN(unitTolerance) ||
      unitTolerance < 0
    ) {
      return {
        status: "REVIEW_REQUIRED",
        reason: "INVALID_PRODUCT_WEIGHT_DATA"
      };
    }

    // 7. Calculate expected total weight
    const expectedWeight = unitExpectedWeight * quantity;

    // 8. Calculate total tolerance
    const tolerance = unitTolerance * quantity;

    // 9. Calculate acceptable range
    const minimumWeight = expectedWeight - tolerance;
    const maximumWeight = expectedWeight + tolerance;

    // 10. Debug information
    console.log("\n========== WEIGHT VERIFICATION ==========");
    console.log("Product:", product.name);
    console.log("Product ID:", productId);
    console.log("Unit Expected Weight:", unitExpectedWeight, "g");
    console.log("Quantity:", quantity);
    console.log("Expected Total Weight:", expectedWeight, "g");
    console.log("Tolerance:", tolerance, "g");
    console.log("Allowed Range:", minimumWeight, "-", maximumWeight, "g");
    console.log("Actual Weight:", actualWeight, "g");

    // 11. Verify weight
    const isWeightValid =
      actualWeight >= minimumWeight &&
      actualWeight <= maximumWeight;

    if (isWeightValid) {
      console.log("RESULT: VERIFIED");
      console.log("========================================\n");

      return {
        status: "VERIFIED",
        reason: "WEIGHT_MATCH",
        unitExpectedWeight,
        quantity,
        expectedWeight,
        actualWeight,
        tolerance,
        allowedRange: {
          minimum: minimumWeight,
          maximum: maximumWeight
        }
      };
    }

    // 12. Weight mismatch
    console.log("RESULT: REVIEW_REQUIRED");
    console.log("REASON: WEIGHT_MISMATCH");
    console.log("========================================\n");

    return {
      status: "REVIEW_REQUIRED",
      reason: "WEIGHT_MISMATCH",
      unitExpectedWeight,
      quantity,
      expectedWeight,
      actualWeight,
      tolerance,
      allowedRange: {
        minimum: minimumWeight,
        maximum: maximumWeight
      }
    };

  } catch (error) {
    console.error("Weight verification error:", error);

    return {
      status: "REVIEW_REQUIRED",
      reason: "WEIGHT_VERIFICATION_ERROR",
      error: error.message
    };
  }
};

module.exports = {
  verifyWeight
};