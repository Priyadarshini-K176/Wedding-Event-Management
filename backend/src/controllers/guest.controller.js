const Guest = require("../models/Guest");

const addGuest = async (req, res) => {
  try {
    const { name, phone, side, events } = req.body;
    const { weddingId } = req.user; // from JWT

    if (!name || !phone || !side) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, and side are required",
      });
    }

    const guest = await Guest.create({
      name,
      phone,
      side,
      events,
      weddingId,
    });

    res.status(201).json({
      success: true,
      data: guest,
      message: "Guest added successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getGuests = async (req, res) => {
  try {
    const { weddingId } = req.user;

    const guests = await Guest.find({ weddingId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: guests,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { addGuest, getGuests };
