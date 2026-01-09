import { motion } from "framer-motion";

export default function EventCard({ event, onDelete }) {
  if (!event) return null;
  
  let start = "", end = "";
  try {
    start = new Date(event.startTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    end = new Date(event.endTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    console.error("Error parsing event times:", e);
    start = "Invalid time";
    end = "Invalid time";
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{
        backgroundColor: 'var(--white)',
        borderLeftColor: 'var(--primary-accent)',
        borderLeftWidth: '5px',
      }} className="rounded-lg shadow-sm hover:shadow-lg transition p-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
        <div className="flex-1">
          <h3 style={{ color: 'var(--deep-text)', fontFamily: "var(--font-body)" }} className="font-bold text-xl leading-tight mb-3">
            {event.title}
          </h3>
          <div style={{ color: 'var(--muted-text)', fontFamily: "var(--font-body)" }} className="flex items-center gap-2 text-base">
            <span style={{ color: 'var(--primary-accent)' }} className="text-lg">🕐</span>
            <span>{start}</span>
            <span>–</span>
            <span>{end}</span>
          </div>
        </div>

        <button
          onClick={() => onDelete(event._id)}
          style={{
            backgroundColor: 'var(--primary-accent)',
            color: 'var(--white)',
            fontFamily: "var(--font-body)",
          }}
          className="px-8 py-3 rounded-lg text-base font-semibold hover:opacity-80 transition whitespace-nowrap shadow-sm hover:shadow-md"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
}
