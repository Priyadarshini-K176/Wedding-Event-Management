import { Link } from "react-router-dom";
import "../styles/overview.css";

const Overview = () => {
  return (
    <div className="landing">
      <header className="landing-header">
        <h1>Plan Your Wedding Effortlessly</h1>
        <p>
          Manage your budget, itinerary, guests, and events — all in one place.
        </p>

        <div className="landing-actions">
          <Link to="/login" className="primary-btn">Login</Link>
          <Link to="/signup" className="secondary-btn">Sign Up</Link>
        </div>
      </header>

      <section className="features">
        <div className="feature-card">
          <h3>💰 Smart Budgeting</h3>
          <p>Track planned vs actual costs and avoid overspending.</p>
        </div>

        <div className="feature-card">
          <h3>📅 Wedding Itinerary</h3>
          <p>Organize events with conflict detection.</p>
        </div>

        <div className="feature-card">
          <h3>👥 Guest Management</h3>
          <p>Track invitations, RSVPs, and seating.</p>
        </div>
      </section>
    </div>
  );
};

export default Overview;
