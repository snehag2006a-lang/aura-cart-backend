const express = require("express");

const {
  recognizeProduct
} = require("../controllers/aiRecognitionController");

const router = express.Router();

router.post("/recognize", recognizeProduct);

module.exports = router;