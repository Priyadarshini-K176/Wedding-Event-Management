import { useEffect, useState } from "react";
import EventForm from "../components/EventForm";
import Timeline from "../components/Timeline";
import {
  createEventApi,
  deleteEventApi,
  fetchEventsApi,
} from "../services/eventApi";

export default function Itinerary() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await fetchEventsApi();
      const data = res.data?.events || res.data?.data || res.data || [];
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load events:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);
  const handleAddEvent = async (data) => {
    try {
      await createEventApi(data);
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

const filtered = Array.isArray(events) ? events.filter((e) =>
  e.title?.toLowerCase().includes(search.toLowerCase())
) : [];

  return (
    <div style={{ backgroundColor: 'var(--soft-bg)', minHeight: '100vh' }} className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
          {/* Header */}
          <div className="mb-10 sm:mb-12 text-center">
            <h1 style={{ color: 'var(--deep-text)', fontFamily: "var(--font-heading)", fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '700', letterSpacing: '0.5px' }} className="mb-2 sm:mb-3">
              ✨ Event Planner
            </h1>
            <p style={{ color: 'var(--muted-text)', fontFamily: "var(--font-body)" }} className="text-base sm:text-lg">Organize your special moments</p>
          </div>

          {/* Main layout with sidebar + content */}
          <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr' }}>
            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '240px 1fr' }}>

              <div>
                {/* Two Column Layout inside content area */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                  gap: '2rem',
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ position: 'sticky', top: '2rem' }}>
                      <EventForm onAdd={handleAddEvent} />
                    </div>
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div className="mb-8 sm:mb-10">
                      <input
                        style={{ backgroundColor: 'var(--white)', borderColor: 'var(--border-neutral)', color: 'var(--deep-text)' }}
                        className="w-full border rounded-full px-5 sm:px-6 py-3 sm:py-4 focus:outline-none shadow-sm hover:shadow-md transition text-base"
                        placeholder="🔍 Search events..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>

                    <div>
                      {loading && (
                        <p className="text-center py-16" style={{ color: 'var(--muted-text)' }}>
                          Loading your events...
                        </p>
                      )}

                      {!loading && (
                        <>
                          {filtered.length > 0 ? (
                            <div>
                              <h2 style={{ color: 'var(--deep-text)', fontFamily: "var(--font-body)" }} className="text-xl sm:text-2xl font-bold mb-8">
                                Upcoming Events ({filtered.length})
                              </h2>
                              <Timeline events={filtered} onDelete={handleDeleteEvent} />
                            </div>
                          ) : (
                            <div className="text-center py-16">
                              <p style={{ color: 'var(--muted-text)' }} className="text-base sm:text-lg">No events planned yet. Create one to get started!</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
