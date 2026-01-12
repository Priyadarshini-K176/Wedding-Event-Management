const Event = require("../models/Event");

const createEvent = async (req, res) => {
  try {
    const { title, startTime, endTime, eventType } = req.body;
    // TODO: Remove fallback after frontend auth is implemented
    const weddingId = req.user?.weddingId || "507f1f77bcf86cd799439011";
    const userId = req.user?.userId || "507f1f77bcf86cd799439012";

    // conflict detection
    const conflict = await Event.findOne({
      weddingId,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        data: null,
        error: "Event overlaps with another event"
      });
    }

    const event = await Event.create({
      weddingId,
      title,
      startTime,
      endTime,
      eventType,
      createdBy: userId
    });

    res.status(201).json({
      success: true,
      data: event,
      error: null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      error: err.message
    });
  }
};

const getEvents = async (req, res) => {
  try {
    // TODO: Remove fallback after frontend auth is implemented
    const weddingId = req.user?.weddingId || "507f1f77bcf86cd799439011";
    const events = await Event.find({
      weddingId
    }).sort({ startTime: 1 });

    res.json({
      success: true,
      data: events,
      error: null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      error: err.message
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, startTime, endTime, eventType } = req.body;
    // TODO: Remove fallback after frontend auth is implemented
    const weddingId = req.user?.weddingId || "507f1f77bcf86cd799439011";

    // conflict check (exclude current event)
    const conflict = await Event.findOne({
      _id: { $ne: id },
      weddingId,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        data: null,
        error: "Updated event overlaps with another event"
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, startTime, endTime, eventType },
      { new: true }
    );

    res.json({
      success: true,
      data: updatedEvent,
      error: null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      error: err.message
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: "Event deleted successfully",
      error: null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      error: err.message
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
};
