import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    eventType: {
      type: String,
      default: "general"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  { timestamps: true }
);

// performance index
EventSchema.index({ weddingId: 1, startTime: 1 });

export default mongoose.model("Event", EventSchema);
