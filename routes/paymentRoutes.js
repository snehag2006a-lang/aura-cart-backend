const express = require("express");

const {
  processPaymentController
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/process", processPaymentController);

module.exports = router;