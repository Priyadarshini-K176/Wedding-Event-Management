import "../styles/dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* 1. TOP NAVIGATION / HEADER */}
      <header className="dashboard-header">
        <div className="welcome-text">
          <h1>Hello, Rahul</h1>
          <p>Your wedding is in 124 days. Here is your overview.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">Edit Profile</button>
          <button className="btn-primary">+ Add Task</button>
        </div>
      </header>

      {/* 2. STATS ROW */}
      <div className="stats-row">
        <div className="stat-item">
          <span className="stat-label">Total Budget</span>
          <span className="stat-value">₹ 15,00,000</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Spent so far</span>
          <span className="stat-value color-green">₹ 3,20,000</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Guests Invited</span>
          <span className="stat-value">150</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending RSVPs</span>
          <span className="stat-value color-gold">42</span>
        </div>
      </div>

      {/* 3. MAIN CONTENT GRID */}
      <div className="dashboard-grid">
        
        {/* Left Column: Timeline */}
        <div className="grid-card">
          <div className="card-header">
            <h3>Upcoming Timeline</h3>
            <a href="/itinerary" className="text-link">View Full Schedule</a>
          </div>
          <div className="timeline-list">
            <div className="timeline-event">
              <div className="event-date">Oct 12</div>
              <div className="event-details">
                <strong>Pre-Wedding Shoot</strong>
                <span>Cubbon Park, 6:00 AM</span>
              </div>
            </div>
            <div className="timeline-event">
              <div className="event-date">Nov 05</div>
              <div className="event-details">
                <strong>Catering Tasting</strong>
                <span>Grand Plaza Hotel</span>
              </div>
            </div>
            <div className="timeline-event">
              <div className="event-date">Dec 20</div>
              <div className="event-details">
                <strong>Mehendi Ceremony</strong>
                <span>Home Garden</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Links */}
        <div className="grid-card">
          <div className="card-header">
            <h3>Quick Access</h3>
          </div>
          <div className="links-stack">
            <a href="/budget" className="stack-link">
              <span>Budget Calculator</span>
              <span className="arrow">→</span>
            </a>
            <a href="/guests" className="stack-link">
              <span>Guest Management</span>
              <span className="arrow">→</span>
            </a>
            <a href="/vendors" className="stack-link">
              <span>Vendor Contacts</span>
              <span className="arrow">→</span>
            </a>
            <a href="/checklist" className="stack-link">
              <span>Planning Checklist</span>
              <span className="arrow">→</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;