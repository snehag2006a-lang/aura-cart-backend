const express = require("express");

const {
  verifyWeightController
} = require("../controllers/weightVerificationController");

const router = express.Router();

router.post("/product", verifyWeightController);

module.exports = router;