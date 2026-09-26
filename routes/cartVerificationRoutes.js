const express = require("express");

const {
  verifyCartItemController
} = require("../controllers/cartVerificationController");

const router = express.Router();

router.post("/item", verifyCartItemController);

module.exports = router;