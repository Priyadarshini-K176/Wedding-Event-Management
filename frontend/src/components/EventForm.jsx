import { useState } from "react";

export default function EventForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !startTime || !endTime) return;

    await onAdd({ title, startTime, endTime, eventType: "General" });
    setTitle("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <div style={{
      backgroundColor: 'var(--white)',
      borderColor: 'var(--border-neutral)',
      borderWidth: '1px',
    }} className="shadow-lg rounded-2xl p-6 sm:p-8 space-y-5 w-full">
      <div>
        <h2 style={{ color: 'var(--deep-text)', fontFamily: "var(--font-heading)", fontSize: 'clamp(1.5rem, 4vw, 1.75rem)', fontWeight: '700' }} className="mb-1">Create Event</h2>
        <p style={{ color: 'var(--muted-text)', fontFamily: "var(--font-body)" }} className="text-sm">Add a new event to your itinerary</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        <div>
          <label style={{ color: 'var(--deep-text)', fontFamily: "var(--font-body)" }} className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3">Event Title</label>
          <input
            style={{
              borderColor: 'var(--border-neutral)',
              color: 'var(--deep-text)',
              backgroundColor: 'var(--soft-bg)',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            }}
            className="w-full border-2 rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 focus:outline-none transition"
            placeholder="e.g., Ceremony"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label style={{ color: 'var(--deep-text)', fontFamily: "var(--font-body)" }} className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3">Start Time</label>
          <input
            type="datetime-local"
            style={{
              borderColor: 'var(--border-neutral)',
              color: 'var(--deep-text)',
              backgroundColor: 'var(--soft-bg)',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            }}
            className="w-full border-2 rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 focus:outline-none transition"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div>
          <label style={{ color: 'var(--deep-text)', fontFamily: "var(--font-body)" }} className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3">End Time</label>
          <input
            type="datetime-local"
            style={{
              borderColor: 'var(--border-neutral)',
              color: 'var(--deep-text)',
              backgroundColor: 'var(--soft-bg)',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            }}
            className="w-full border-2 rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 focus:outline-none transition"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <button style={{
          backgroundColor: 'var(--primary-accent)',
          color: 'var(--white)',
          fontFamily: "var(--font-body)",
          fontWeight: '600',
        }} className="w-full rounded-lg py-3 sm:py-4 font-semibold hover:opacity-90 transition mt-2 sm:mt-4 text-sm sm:text-base tracking-wide shadow-sm hover:shadow-md">
          + Add Event
        </button>

      </form>
    </div>
  );
}
