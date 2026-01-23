const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for performance
noteSchema.index({ weddingId: 1 });
noteSchema.index({ weddingId: 1, createdAt: -1 });

module.exports = mongoose.model("Note", noteSchema);
