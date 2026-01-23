const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wedding",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true
    },

    order: {
      type: Number,
      default: 0
    },

    plannedBudget: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

// Indexes for performance
categorySchema.index({ weddingId: 1 });
categorySchema.index({ weddingId: 1, order: 1 });

module.exports = mongoose.model("Category", categorySchema);
