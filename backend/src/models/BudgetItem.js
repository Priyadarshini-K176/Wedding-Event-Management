const mongoose = require("mongoose");

const budgetItemSchema = new mongoose.Schema(
  {
    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wedding",
      required: true,
      index: true
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    plannedCost: {
      type: Number,
      default: 0,
      min: 0
    },

    actualCost: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

// Indexes for performance
budgetItemSchema.index({ weddingId: 1 });
budgetItemSchema.index({ weddingId: 1, categoryId: 1 });
budgetItemSchema.index({ categoryId: 1 });

module.exports = mongoose.model("BudgetItem", budgetItemSchema);
