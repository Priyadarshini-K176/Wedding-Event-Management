import EventCard from "./EventCard";

export default function Timeline({ events, onDelete }) {
  if (!events.length)
    return <p className="text-center text-gray-500">No events yet</p>;

  return (
    <div className="space-y-6 sm:space-y-8">
      {events.map((event) => (
        <EventCard key={event._id} event={event} onDelete={onDelete} />
      ))}
    </div>
  );
}
