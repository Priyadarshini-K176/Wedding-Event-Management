const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    side: {
      type: String,
      enum: ["BRIDE", "GROOM"],
      required: true,
    },

    events: {
      type: [String],
      default: [],
    },

    rsvp: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "DECLINED"],
      default: "PENDING",
    },

    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wedding",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guest", guestSchema);
