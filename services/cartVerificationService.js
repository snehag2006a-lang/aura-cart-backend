const CartItem = require("../models/CartItem");
const ShoppingSession = require("../models/ShoppingSession");
const Trolley = require("../models/Trolley");
const Product = require("../models/Product");

const { verifyProduct } = require("./verificationService");
const { verifyWeight } = require("./weightVerificationService");
const { createLossPreventionAlert } = require("./lossPreventionService");

const verifyCartItem = async (cartItemId, actualWeight) => {
  try {
    // Find cart item
    const cartItem = await CartItem.findById(cartItemId);

    if (!cartItem) {
      return {
        status: "REVIEW_REQUIRED",
        reason: "CART_ITEM_NOT_FOUND"
      };
    }

    // Find shopping session
    const session = await ShoppingSession.findById(
      cartItem.sessionId
    );

    if (!session) {
      return {
        status: "REVIEW_REQUIRED",
        reason: "SESSION_NOT_FOUND"
      };
    }

    // Find trolley
    const trolley = await Trolley.findById(
      session.trolleyId
    );

    if (!trolley) {
      return {
        status: "REVIEW_REQUIRED",
        reason: "TROLLEY_NOT_FOUND"
      };
    }

    // Find product
    const product = await Product.findById(
      cartItem.productId
    );

    if (!product) {
      cartItem.verificationStatus = "REVIEW_REQUIRED";
      await cartItem.save();

      // Create alert for unknown product
      await createLossPreventionAlert({
        sessionId: session._id,
        trolleyId: trolley._id,
        productId: null,
        alertType: "UNKNOWN_PRODUCT",
        severity: "HIGH",
        message:
          "Product could not be identified. Verification required.",
        source: "CONSISTENCY_ENGINE"
      });

      return {
        status: "REVIEW_REQUIRED",
        reason: "UNKNOWN_PRODUCT"
      };
    }

    // Step 1: Product verification
    const productResult = await verifyProduct(
      cartItem.productId
    );

    // Step 2: Weight verification
    // Include cart quantity so multiple units are verified correctly.
    const weightResult = await verifyWeight(
      cartItem.productId,
      actualWeight,
      cartItem.quantity
    );

    // Final decision
    if (
      productResult.status === "VERIFIED" &&
      weightResult.status === "VERIFIED"
    ) {
      cartItem.verificationStatus = "VERIFIED";
      await cartItem.save();

      return {
        status: "VERIFIED",
        reason: "PRODUCT_AND_WEIGHT_MATCH",
        cartItemId: cartItem._id,
        sessionId: session._id,
        trolleyId: trolley._id,
        productId: product._id,
        quantity: cartItem.quantity,
        productVerification: productResult.status,
        weightVerification: weightResult.status,
        expectedWeight: weightResult.expectedWeight,
        actualWeight,
        tolerance: weightResult.tolerance,
        allowedRange: weightResult.allowedRange
      };
    }

    // Verification failed
    cartItem.verificationStatus = "REVIEW_REQUIRED";
    await cartItem.save();

    // Determine alert details
    let alertType = "BILLING_ANOMALY";
    let severity = "MEDIUM";
    let message =
      "Item verification failed. Store review is required.";

    if (weightResult.status !== "VERIFIED") {
      alertType = "WEIGHT_MISMATCH";
      severity = "HIGH";
      message =
        "Product weight does not match expected weight. Verification required.";
    } else if (productResult.status !== "VERIFIED") {
      alertType = "PRODUCT_MISMATCH";
      severity = "HIGH";
      message =
        "Product verification failed. Verification required.";
    }

    // Create loss prevention alert
    await createLossPreventionAlert({
      sessionId: session._id,
      trolleyId: trolley._id,
      productId: product._id,
      alertType,
      severity,
      message,
      source: "CONSISTENCY_ENGINE"
    });

    return {
      status: "REVIEW_REQUIRED",
      reason:
        weightResult.status !== "VERIFIED"
          ? weightResult.reason
          : productResult.reason,
      cartItemId: cartItem._id,
      sessionId: session._id,
      trolleyId: session.trolleyId,
      productId: product._id,
      quantity: cartItem.quantity,
      productVerification: productResult.status,
      weightVerification: weightResult.status,
      expectedWeight: weightResult.expectedWeight,
      actualWeight,
      tolerance: weightResult.tolerance,
      allowedRange: weightResult.allowedRange
    };
  } catch (error) {
    return {
      status: "REVIEW_REQUIRED",
      reason: "CART_VERIFICATION_ERROR",
      error: error.message
    };
  }
};

module.exports = {
  verifyCartItem
};