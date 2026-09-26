const express = require("express");

const {
  createAlertController,
  getAlertsController
} = require("../controllers/lossPreventionController");

const router = express.Router();

// Create loss prevention alert
router.post("/alert", createAlertController);

// Get all loss prevention alerts
router.get("/alerts", getAlertsController);

module.exports = router;