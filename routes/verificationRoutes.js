const express = require("express");

const {
  verifyProductController
} = require("../controllers/verificationController");

const router = express.Router();

// Verify product
router.post("/product", verifyProductController);

module.exports = router;