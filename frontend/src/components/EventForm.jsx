import { useState, useEffect } from "react";

export default function EventForm({ onAdd, event }) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      // Pre-fill form with event data for editing
      setTitle(event.title || "");
      
      // Convert ISO string to datetime-local format
      if (event.startTime) {
        const startDate = new Date(event.startTime);
        setStartTime(startDate.toISOString().slice(0, 16));
      }
      if (event.endTime) {
        const endDate = new Date(event.endTime);
        setEndTime(endDate.toISOString().slice(0, 16));
      }
    }
  }, [event]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  
  if (!title || !startTime || !endTime) {
    setError("Please fill in all fields");
    return;
  }

  if (startTime >= endTime) {
    setError("End time must be after start time");
    return;
  }

  // Convert datetime-local strings to ISO date strings
  const startDate = new Date(startTime).toISOString();
  const endDate = new Date(endTime).toISOString();

  console.log("Submitting event:", { title, startTime: startDate, endTime: endDate, isEditing: !!event });

  try {
    setIsSubmitting(true);
    await onAdd({ title, startTime: startDate, endTime: endDate, eventType: "General" });

    // Only clear form if adding new event, not when editing
    if (!event) {
      setTitle("");
      setStartTime("");
      setEndTime("");
    }
  } catch (err) {
    const errorMsg = err.response?.data?.error || err.message || "Failed to save event";
    setError(errorMsg);
    console.error("Error details:", err);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="event-form-card">
      <div className="event-form-header">
        <h2>{event ? "Edit Event" : "Create Event"}</h2>
        <p>{event ? "Update your event details" : "Add a new event to your itinerary"}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label>Event Title</label>
          <input
            type="text"
            placeholder="e.g., Ceremony"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <button className="modal-add-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (event ? "Updating..." : "Adding...") : (event ? "Update Event" : "+ Add Event")}
        </button>
      </form>
    </div>
  );
}
