const Note = require("../models/Note");

/* ================================
   CREATE NOTE
================================ */
const createNote = async (req, res) => {
  try {
    const { text } = req.body;

    const weddingId = req.user?.weddingId || "507f1f77bcf86cd799439011";
    const userId = req.user?.userId || "507f1f77bcf86cd799439012";

    const note = await Note.create({
      weddingId,
      text,
      createdBy: userId,
    });

    res.status(201).json({
      success: true,
      data: note,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      error: err.message,
    });
  }
};

/* ================================
   GET NOTES
================================ */
const getNotes = async (req, res) => {
  try {
    const weddingId = req.user?.weddingId || "507f1f77bcf86cd799439011";

    const notes = await Note.find({ weddingId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: notes,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      error: err.message,
    });
  }
};

/* ================================
   DELETE NOTE
================================ */
const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: "Note deleted",
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      error: err.message,
    });
  }
};

module.exports = {
  createNote,
  getNotes,
  deleteNote,
};
