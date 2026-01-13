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
          <h3> Smart Budgeting</h3>
          <p>Track planned vs actual costs and avoid overspending.</p>
        </div>

        <div className="feature-card">
          <h3> Wedding Itinerary</h3>
          <p>Organize events with conflict detection.</p>
        </div>

        <div className="feature-card">
          <h3> Guest Management</h3>
          <p>Track invitations, RSVPs, and seating.</p>
        </div>

        <div className="feature-card">
          <h3> Notes & Tasks</h3>
          <p>Keep track of important details and to-do items.</p>
        </div>

        <div className="feature-card">
          <h3> Analytics</h3>
          <p>Get insights on spending patterns and guest responses.</p>
        </div>

        <div className="feature-card">
          <h3> Mobile Ready</h3>
          <p>Access your wedding plans anywhere, anytime.</p>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Sign Up</h4>
            <p>Create your account and set your wedding date</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>Plan</h4>
            <p>Add your budget, guests, and events</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Track</h4>
            <p>Monitor progress and stay organized</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>What Couples Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial">
            <p>"This app saved us so much stress! Everything was organized perfectly."</p>
            <span>- Sarah & Mike</span>
          </div>
          <div className="testimonial">
            <p>"The budget tracking feature helped us stay within our limits."</p>
            <span>- Emma & James</span>
          </div>
          <div className="testimonial">
            <p>"Guest management made our RSVP process so much easier."</p>
            <span>- Lisa & David</span>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Plan Your Perfect Wedding?</h2>
        <p>Join thousands of couples who've made their wedding planning stress-free</p>
        <Link to="/signup" className="cta-btn">Get Started Free</Link>
      </section>
    </div>
  );
};

export default Overview;
