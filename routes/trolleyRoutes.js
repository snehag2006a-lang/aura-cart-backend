const express = require("express");

const {
  createTrolley,
  getTrolleys
} = require("../controllers/trolleyController");

const router = express.Router();

// Create trolley
router.post("/", createTrolley);

// Get all trolleys
router.get("/", getTrolleys);

module.exports = router;