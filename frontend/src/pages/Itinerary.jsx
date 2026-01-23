import { useEffect, useState } from "react";
import EventForm from "../components/EventForm";
import Timeline from "../components/Timeline";
import {
  createEventApi,
  deleteEventApi,
  fetchEventsApi,
  updateEventApi,
} from "../services/eventApi";
import "../styles/itinerary.css";

export default function Itinerary() {
  const [events, setEvents] = useState(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    // Load profile data
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

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
      let res;
      if (editingEvent) {
        // Update existing event
        res = await updateEventApi(editingEvent._id, eventData);
      } else {
        // Create new event
        res = await createEventApi(eventData);
      }
      
      if (res.data?.success) {
        setShowEventDialog(false);
        setEditingEvent(null);
        loadEvents();
      } else {
        alert("Failed to save event: " + (res.data?.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error details:", err.response?.data);
      alert("Error: " + (err.response?.data?.error || err.message || "Failed to save event"));
    }
  };

  const handleEditEvent = (event) => {
    console.log("Editing event:", event);
    setEditingEvent(event);
    setShowEventDialog(true);
  };

  const handleDuplicateEvent = (event) => {
    console.log("Duplicating event:", event);
    const newEvent = {
      title: event.title + " (Copy)",
      startTime: event.startTime,
      endTime: event.endTime,
      eventType: event.eventType
    };
    handleAddEvent(newEvent);
  };

  const closeEventDialog = () => {
    setShowEventDialog(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      console.log("Deleting event ID:", id);
      const res = await deleteEventApi(id);
      console.log("Delete response:", res.data);
      if (res.data?.success) {
        loadEvents();
        alert("Event deleted successfully");
      } else {
        alert("Failed to delete event: " + (res.data?.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Delete error details:", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.error || err.message || "Failed to delete event"));
    }
  };

  const handleDownloadPDF = () => {
    if (sortedEvents.length === 0) {
      alert("No events to download");
      return;
    }

    // Get profile data for personalization
    const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    const coupleName = profile.name && profile.partnerName 
      ? `${profile.name} & ${profile.partnerName}`
      : profile.name || "Wedding";

    // Create PDF content
    const content = `
      ${coupleName} - Wedding Itinerary
      Generated on: ${new Date().toLocaleDateString()}
      Wedding Date: ${profile.weddingDate ? new Date(profile.weddingDate).toLocaleDateString() : 'TBD'}
      Venue: ${profile.venue || 'TBD'}
      
      EVENTS SCHEDULE:
      ================
      ${sortedEvents.map((event, index) => `
        ${index + 1}. ${event.title}
        Date: ${new Date(event.startTime).toLocaleDateString()}
        Time: ${new Date(event.startTime).toLocaleTimeString()} - ${new Date(event.endTime).toLocaleTimeString()}
        Type: ${event.eventType || 'General'}
        
      `).join('')}
    `;

    // Create and download as text file (simple implementation)
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${coupleName.replace(/[^a-zA-Z0-9]/g, '-')}-wedding-itinerary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadICS = () => {
    if (sortedEvents.length === 0) {
      alert("No events to download");
      return;
    }

    // Get profile data for personalization
    const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    const coupleName = profile.name && profile.partnerName 
      ? `${profile.name} & ${profile.partnerName}`
      : profile.name || "Wedding";

    // Create ICS calendar content
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      `PRODID:-//${coupleName} Wedding Planner//EN`,
      'CALSCALE:GREGORIAN',
      `X-WR-CALNAME:${coupleName} Wedding Events`,
      ...sortedEvents.map(event => {
        const startDate = new Date(event.startTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const endDate = new Date(event.endTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const uid = `${event._id || Math.random()}@weddingplanner.com`;
        
        return [
          'BEGIN:VEVENT',
          `UID:${uid}`,
          `DTSTART:${startDate}`,
          `DTEND:${endDate}`,
          `SUMMARY:${event.title}`,
          `DESCRIPTION:${coupleName} Wedding Event - ${event.eventType || 'General'}`,
          `LOCATION:${profile.venue || ''}`,
          'END:VEVENT'
        ].join('\n');
      }),
      'END:VCALENDAR'
    ].join('\n');

    // Download ICS file
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${coupleName.replace(/[^a-zA-Z0-9]/g, '-')}-wedding-itinerary.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!events) return <div className="empty-state">Loading...</div>;

  // ✅ SORT EVENTS BY START TIME (TIMELINE ORDER)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startTime) - new Date(b.startTime)
  );

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Wedding Itinerary</h1>
        {profile.weddingDate && (
          <p className="wedding-info">
            {profile.name && profile.partnerName && `${profile.name} & ${profile.partnerName} • `}
            {new Date(profile.weddingDate).toLocaleDateString()}
            {profile.venue && ` • ${profile.venue}`}
          </p>
        )}
      </div>

      {sortedEvents.length > 0 ? (
        <Timeline 
          events={sortedEvents} 
          onDelete={handleDeleteEvent}
          onEdit={handleEditEvent}
          onDuplicate={handleDuplicateEvent}
        />
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
        <button className="secondary-btn" onClick={handleDownloadPDF}>Download PDF</button>
        <button className="secondary-btn" onClick={handleDownloadICS}>Download ICS</button>
      </div>

      {showEventDialog && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <h3>{editingEvent ? "Edit Event" : "Add Event"}</h3>
            <EventForm onAdd={handleAddEvent} event={editingEvent} />
            <div className="dialog-actions">
              <button onClick={closeEventDialog}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}