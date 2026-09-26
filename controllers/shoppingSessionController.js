const ShoppingSession = require("../models/ShoppingSession");
const Trolley = require("../models/Trolley");

// Create a new shopping session
const createShoppingSession = async (req, res) => {
  try {
    const { sessionId, trolleyId } = req.body;

    // Check whether trolley exists
    const trolley = await Trolley.findById(trolleyId);

    if (!trolley) {
      return res.status(404).json({
        success: false,
        message: "Trolley not found"
      });
    }

    // Check whether trolley is available
    if (trolley.status !== "AVAILABLE") {
      return res.status(400).json({
        success: false,
        message: "Trolley is not available"
      });
    }

    // Create shopping session
    const session = await ShoppingSession.create({
      sessionId,
      trolleyId
    });

    // Mark trolley as in use
    trolley.status = "IN_USE";
    await trolley.save();

    res.status(201).json({
      success: true,
      message: "Shopping session created successfully",
      session
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create shopping session",
      error: error.message
    });
  }
};

// Get all shopping sessions
const getShoppingSessions = async (req, res) => {
  try {
    const sessions = await ShoppingSession.find()
      .populate("trolleyId");

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch shopping sessions",
      error: error.message
    });
  }
};

module.exports = {
  createShoppingSession,
  getShoppingSessions
};