const mongoose = require("mongoose");

const budgetSnapshotSchema = new mongoose.Schema(
  {
    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wedding",
      required: true,
      index: true
    },

    version: {
      type: Number,
      required: true
    },

    data: {
      type: Object,
      required: true
    }
  },
  { timestamps: true }
);

// Indexes for performance
budgetSnapshotSchema.index({ weddingId: 1, version: -1 });

module.exports = mongoose.model("BudgetSnapshot", budgetSnapshotSchema);
