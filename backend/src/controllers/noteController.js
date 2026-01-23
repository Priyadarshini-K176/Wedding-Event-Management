const Note = require("../models/Note");

/* ================================
   CREATE NOTE
================================ */
const createNote = async (req, res) => {
  try {
    const { text } = req.body;

    if (!req.user || !req.user.weddingId || !req.user.userId) {
      return res.status(401).json({
        success: false,
        data: null,
        error: "Authentication required",
      });
    }

    const weddingId = req.user.weddingId;
    const userId = req.user.userId;

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
    if (!req.user || !req.user.weddingId) {
      return res.status(401).json({
        success: false,
        data: null,
        error: "Authentication required",
      });
    }

    const weddingId = req.user.weddingId;

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

/* ================================
   UPDATE NOTE
================================ */
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!req.user || !req.user.weddingId) {
      return res.status(401).json({
        success: false,
        data: null,
        error: "Authentication required",
      });
    }

    const note = await Note.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        data: null,
        error: "Note not found",
      });
    }

    res.json({
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

module.exports = {
  createNote,
  getNotes,
  deleteNote,
  updateNote,
};
