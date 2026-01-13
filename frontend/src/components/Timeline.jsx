import EventCard from "./EventCard";

export default function Timeline({ events, onDelete, onEdit, onDuplicate }) {
  if (!events.length) {
    return <p className="empty-state">No events yet</p>;
  }

  // Group events by date
  const grouped = events.reduce((acc, event) => {
    const dateKey = new Date(event.startTime).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(grouped).map(([date, dayEvents]) => (
        <div key={date} className="date-group">
          <h3 className="date-heading">
            {new Date(date).toLocaleDateString([], {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })}
          </h3>

          <div className="event-day-list">
            {dayEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onDelete={onDelete}
                onEdit={onEdit}
                onDuplicate={onDuplicate}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
