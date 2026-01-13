import { motion } from "framer-motion";

export default function EventCard({ event, onDelete, onEdit, onDuplicate }) {
  if (!event) return null;

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
            <span className="clock">🕐</span>
            <span>{start}</span>
            <span> – </span>
            <span>{end}</span>
          </div>
        </div>

        <div className="event-actions">
          <button
            onClick={() => onEdit(event)}
            className="action-btn edit"
            title="Edit event"
          >
            ✏️
          </button>
          <button
            onClick={() => onDuplicate(event)}
            className="action-btn duplicate"
            title="Duplicate event"
          >
            📋
          </button>
          <button
            onClick={() => onDelete(event)}
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
