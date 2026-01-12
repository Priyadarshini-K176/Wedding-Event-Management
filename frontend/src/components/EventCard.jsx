import { motion } from "framer-motion";

export default function EventCard({ event, onDelete }) {
  if (!event) return null;

  let startDate = "";
  let start = "";
  let end = "";

  try {
    const startObj = new Date(event.startTime);

    startDate = startObj.toLocaleDateString([], {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

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
    startDate = "Invalid date";
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

          <div className="event-date">{startDate}</div>

          <div className="event-time">
            <span className="clock"></span>
            <span>{start}</span>
            <span> – </span>
            <span>{end}</span>
          </div>
        </div>

        <button
          onClick={() => onDelete(event._id)}
          className="delete-btn"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
}
