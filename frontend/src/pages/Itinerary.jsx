import { useEffect, useState } from "react";
import EventForm from "../components/EventForm";
import Timeline from "../components/Timeline";
import {
  createEventApi,
  deleteEventApi,
  fetchEventsApi,
} from "../services/eventApi";
import "../styles/itinerary.css";

export default function Itinerary() {
  const [events, setEvents] = useState(null);
  const [showEventDialog, setShowEventDialog] = useState(false);

  const loadEvents = async () => {
    try {
      const res = await fetchEventsApi();
      const data = res.data?.events || res.data?.data || res.data || [];
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load events:", err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleAddEvent = async (eventData) => {
    try {
      await createEventApi(eventData);
      setShowEventDialog(false);
      loadEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await deleteEventApi(id);
      loadEvents();
    } catch (err) {
      console.error(err);
    }
  };

  if (!events) return <div className="empty-state">Loading...</div>;

  // ✅ SORT EVENTS BY START TIME (TIMELINE ORDER)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startTime) - new Date(b.startTime)
  );

  return (
    <>
      <h1 className="page-title">Itinerary</h1>

      {sortedEvents.length > 0 ? (
        <Timeline events={sortedEvents} onDelete={handleDeleteEvent} />
      ) : (
        <div className="empty-state">
          <h3>No events planned yet</h3>
          <p>Create one to get started!</p>
        </div>
      )}

      <button className="add-event-btn" onClick={() => setShowEventDialog(true)}>
        + Add event
      </button>

      <div className="event-footer">
        <span>Total Events</span>
        <strong>{sortedEvents.length}</strong>
      </div>

      <div className="itinerary-actions">
        <button className="secondary-btn">Download PDF</button>
        <button className="secondary-btn">Download ICS</button>
      </div>

      {showEventDialog && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <h3>Add Event</h3>
            <EventForm onAdd={handleAddEvent} />
            <div className="dialog-actions">
              <button onClick={() => setShowEventDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
