import "../styles/skeleton.css";

export default function SkeletonLoader({ type = "event", count = 3 }) {
  if (type === "event") {
    return (
      <div className="skeleton-container">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="skeleton-event-card">
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-time"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "profile") {
    return (
      <div className="skeleton-profile">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-profile-info">
          <div className="skeleton-line skeleton-name"></div>
          <div className="skeleton-line skeleton-email"></div>
        </div>
      </div>
    );
  }

  return null;
}