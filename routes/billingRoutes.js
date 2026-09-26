const express = require("express");

const {
  generateBillController
} = require("../controllers/billingController");

const router = express.Router();

router.post("/generate", generateBillController);

module.exports = router;
