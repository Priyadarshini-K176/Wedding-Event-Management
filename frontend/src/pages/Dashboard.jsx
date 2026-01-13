import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchEventsApi } from "../services/eventApi";
import { fetchNotesApi } from "../services/notesApi";
import { fetchGuestsApi } from "../services/guest.api";
import { getOverview } from "../services/budget.api";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [profile, setProfile] = useState({});
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalNotes: 0,
    totalGuests: 0,
    budgetSpent: 0,
    daysUntilWedding: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load profile data
      const savedProfile = localStorage.getItem("userProfile");
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        setProfile(profileData);
        
        // Calculate days until wedding
        if (profileData.weddingDate) {
          const weddingDate = new Date(profileData.weddingDate);
          const today = new Date();
          const timeDiff = weddingDate.getTime() - today.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
          setStats(prev => ({ ...prev, daysUntilWedding: daysDiff }));
        }
      }

      // Load real data from APIs
      const [eventsRes, notesRes, guestsRes, budgetRes] = await Promise.allSettled([
        fetchEventsApi(),
        fetchNotesApi(),
        fetchGuestsApi(),
        getOverview()
      ]);

      // Process events data
      if (eventsRes.status === 'fulfilled') {
        const events = eventsRes.value.data?.data || eventsRes.value.data || [];
        const eventsArray = Array.isArray(events) ? events : [];
        setStats(prev => ({ ...prev, totalEvents: eventsArray.length }));
        
        // Get upcoming events (next 3 events)
        const now = new Date();
        const upcoming = eventsArray
          .filter(event => new Date(event.startTime) > now)
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
          .slice(0, 3);
        setUpcomingEvents(upcoming);
      }

      // Process notes data
      if (notesRes.status === 'fulfilled') {
        const notes = notesRes.value.data?.data || [];
        setStats(prev => ({ ...prev, totalNotes: Array.isArray(notes) ? notes.length : 0 }));
      }

      // Process guests data
      if (guestsRes.status === 'fulfilled') {
        const guests = guestsRes.value.data?.data || [];
        setStats(prev => ({ ...prev, totalGuests: Array.isArray(guests) ? guests.length : 0 }));
      }

      // Process budget data
      if (budgetRes.status === 'fulfilled') {
        const budgetData = budgetRes.value.data?.data;
        if (budgetData && budgetData.overallTotal) {
          setStats(prev => ({ ...prev, budgetSpent: budgetData.overallTotal }));
        }
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeddingStatus = () => {
    if (!profile.weddingDate) return "Set your wedding date";
    if (stats.daysUntilWedding < 0) return "Wedding completed!";
    if (stats.daysUntilWedding === 0) return "Wedding day is today!";
    return `${stats.daysUntilWedding} days until your wedding`;
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-state">
          <h2>Loading your wedding dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {profile.name || "User"}!</h1>
        <p className="wedding-countdown">{getWeddingStatus()}</p>
      </div>

      <div className="wedding-info-card">
        <h2>Your Wedding Details</h2>
        <div className="wedding-details">
          <div className="detail-item">
            <span className="label">Couple:</span>
            <span className="value">
              {profile.name && profile.partnerName 
                ? `${profile.name} & ${profile.partnerName}`
                : "Not set"}
            </span>
          </div>
          <div className="detail-item">
            <span className="label">Date:</span>
            <span className="value">
              {profile.weddingDate 
                ? new Date(profile.weddingDate).toLocaleDateString()
                : "Not set"}
            </span>
          </div>
          <div className="detail-item">
            <span className="label">Venue:</span>
            <span className="value">{profile.venue || "Not set"}</span>
          </div>
        </div>
        <Link to="/profile" className="edit-profile-btn">
          Update Details
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalEvents}</div>
          <div className="stat-label">Events Planned</div>
          <Link to="/itinerary" className="stat-link">View Itinerary</Link>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats.totalGuests}</div>
          <div className="stat-label">Guests Invited</div>
          <Link to="/guests" className="stat-link">Manage Guests</Link>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats.totalNotes}</div>
          <div className="stat-label">Notes & Tasks</div>
          <Link to="/notes" className="stat-link">View Notes</Link>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">${stats.budgetSpent}</div>
          <div className="stat-label">Budget Spent</div>
          <Link to="/budget" className="stat-link">View Budget</Link>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <Link to="/itinerary" className="action-btn">
            Add Event
          </Link>
          <Link to="/guests" className="action-btn">
            Add Guest
          </Link>
          <Link to="/notes" className="action-btn">
            Add Note
          </Link>
          <Link to="/budget" className="action-btn">
            Update Budget
          </Link>
        </div>
      </div>

      {upcomingEvents.length > 0 && (
        <div className="upcoming-events">
          <h3>Upcoming Events</h3>
          <div className="events-list">
            {upcomingEvents.map((event) => (
              <div key={event._id} className="upcoming-event-item">
                <div className="event-date">
                  {new Date(event.startTime).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div className="event-details">
                  <h4>{event.title}</h4>
                  <p>{new Date(event.startTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/itinerary" className="view-all-link">
            View All Events →
          </Link>
        </div>
      )}

      {(!profile.name || !profile.weddingDate || !profile.venue) && (
        <div className="setup-reminder">
          <h3>Complete Your Setup</h3>
          <p>Finish setting up your profile to get the most out of your wedding planner.</p>
          <Link to="/profile" className="setup-btn">
            Complete Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;