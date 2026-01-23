import { motion } from "framer-motion";

export default function EventCard({ event, onDelete, onEdit, onDuplicate }) {
  if (!event) return null;

  console.log("EventCard rendered with handlers:", { 
    hasOnEdit: !!onEdit, 
    hasOnDuplicate: !!onDuplicate, 
    hasOnDelete: !!onDelete 
  });

  let start = "";
  let end = "";

  try {
    const startObj = new Date(event.startTime);
    start = startObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const endObj = new Date(event.endTime);
    end = endObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  } catch (e) {
    console.error("Error parsing event times:", e);
    start = "Invalid time";
    end = "Invalid time";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="event-motion"
    >
      <div className="event-card">
        <div className="event-info">
          <h3 className="event-title">{event.title}</h3>

          <div className="event-time">
            <svg className="event-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
            </svg>
            <span>{start}</span>
            <span> – </span>
            <span>{end}</span>
          </div>
        </div>

        <div className="event-actions">
          <button
            onClick={() => {
              console.log("Edit clicked for event:", event);
              onEdit && onEdit(event);
            }}
            className="action-btn edit"
            title="Edit event"
          >
            ✏️
          </button>
          <button
            onClick={() => {
              console.log("Duplicate clicked for event:", event);
              onDuplicate && onDuplicate(event);
            }}
            className="action-btn duplicate"
            title="Duplicate event"
          >
            📋
          </button>
          <button
            onClick={() => {
              console.log("Delete clicked for event ID:", event._id);
              onDelete && onDelete(event._id);
            }}
            className="action-btn delete"
            title="Delete event"
          >
            🗑️
          </button>
        </div>
      </div>
    </motion.div>
  );
}
