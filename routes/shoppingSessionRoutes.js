const express = require("express");

const {
  createShoppingSession,
  getShoppingSessions
} = require("../controllers/shoppingSessionController");

const router = express.Router();

// Create shopping session
router.post("/", createShoppingSession);

// Get all shopping sessions
router.get("/", getShoppingSessions);

module.exports = router;