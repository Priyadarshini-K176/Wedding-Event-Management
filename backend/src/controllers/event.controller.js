import Event from "../models/Event.js";

// TEMP mock user (until auth is added)
const mockUser = {
  weddingId: "65f000000000000000000001",
  userId: "65f000000000000000000002"
};

export const createEvent = async (req, res) => {
  try {
    const { title, startTime, endTime, eventType } = req.body;

    // conflict detection
    const conflict = await Event.findOne({
      weddingId: mockUser.weddingId,
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
      weddingId: mockUser.weddingId,
      title,
      startTime,
      endTime,
      eventType,
      createdBy: mockUser.userId
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

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      weddingId: mockUser.weddingId
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
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, startTime, endTime, eventType } = req.body;
    const weddingId = mockUser.weddingId;

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
export const deleteEvent = async (req, res) => {
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

