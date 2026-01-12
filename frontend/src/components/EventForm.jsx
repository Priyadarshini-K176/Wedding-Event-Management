import { useState } from "react";

export default function EventForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!title || !startTime || !endTime) return;

  console.log("Submitting event:", { title, startTime, endTime });

  try {
    await onAdd({ title, startTime, endTime, eventType: "General" });

    setTitle("");
    setStartTime("");
    setEndTime("");
  } catch (err) {
    alert(err.response?.data?.error || "Failed to create event");
    console.error(err);
  }
};


  return (
    <div className="event-form-card">
      <div className="event-form-header">
        <h2>Create Event</h2>
        <p>Add a new event to your itinerary</p>
      </div>

      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label>Event Title</label>
          <input
            type="text"
            placeholder="e.g., Ceremony"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <button className="modal-add-btn" type="submit">
          + Add Event
        </button>
      </form>
    </div>
  );
}
