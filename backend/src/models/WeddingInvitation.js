const mongoose = require("mongoose");

const weddingInvitationSchema = new mongoose.Schema(
  {
    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wedding",
      required: true
    },
    invitationCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    },
    maxUses: {
      type: Number,
      default: 100
    },
    usedCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Index for finding active codes
weddingInvitationSchema.index({ invitationCode: 1, isActive: 1 });
weddingInvitationSchema.index({ weddingId: 1 });

module.exports = mongoose.model("WeddingInvitation", weddingInvitationSchema);
