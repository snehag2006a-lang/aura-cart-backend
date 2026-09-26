const {
  createLossPreventionAlert
} = require("../services/lossPreventionService");

const Alert = require("../models/Alert");

// Create a new loss prevention alert
const createAlertController = async (req, res) => {
  try {
    const {
      sessionId,
      trolleyId,
      productId,
      alertType,
      severity,
      message,
      source
    } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required"
      });
    }

    if (!trolleyId) {
      return res.status(400).json({
        success: false,
        message: "Trolley ID is required"
      });
    }

    if (!alertType) {
      return res.status(400).json({
        success: false,
        message: "Alert type is required"
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Alert message is required"
      });
    }

    if (!source) {
      return res.status(400).json({
        success: false,
        message: "Alert source is required"
      });
    }

    const result = await createLossPreventionAlert({
      sessionId,
      trolleyId,
      productId,
      alertType,
      severity,
      message,
      source
    });

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create loss prevention alert",
      error: error.message
    });
  }
};

// Get all loss prevention alerts
const getAlertsController = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate("productId")
      .populate("sessionId")
      .populate("trolleyId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch alerts",
      error: error.message
    });
  }
};

module.exports = {
  createAlertController,
  getAlertsController
};