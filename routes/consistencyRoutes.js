const express = require("express");

const {
  checkConsistencyController
} = require("../controllers/consistencyController");

const router = express.Router();

router.post("/check", checkConsistencyController);

module.exports = router;