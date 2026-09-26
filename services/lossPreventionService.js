const Alert = require("../models/Alert");

const createLossPreventionAlert = async ({
  sessionId,
  trolleyId,
  productId = null,
  alertType,
  severity = "MEDIUM",
  message,
  source
}) => {
  try {
    const alert = await Alert.create({
      sessionId,
      trolleyId,
      productId,
      alertType,
      severity,
      message,
      source
    });

    return {
      success: true,
      alert
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create loss prevention alert",
      error: error.message
    };
  }
};

module.exports = {
  createLossPreventionAlert
};