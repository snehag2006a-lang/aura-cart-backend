const Trolley = require("../models/Trolley");

// Create a new trolley
const createTrolley = async (req, res) => {
  try {
    const trolley = await Trolley.create(req.body);

    res.status(201).json({
      success: true,
      message: "Trolley created successfully",
      trolley
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create trolley",
      error: error.message
    });
  }
};

// Get all trolleys
const getTrolleys = async (req, res) => {
  try {
    const trolleys = await Trolley.find();

    res.status(200).json({
      success: true,
      count: trolleys.length,
      trolleys
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch trolleys",
      error: error.message
    });
  }
};

module.exports = {
  createTrolley,
  getTrolleys
};