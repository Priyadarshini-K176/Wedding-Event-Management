import "../styles/error.css";

export default function ErrorMessage({ message, onRetry, type = "general" }) {
  const getErrorIcon = () => {
    switch (type) {
      case "network":
        return "🌐";
      case "server":
        return "⚠️";
      case "notfound":
        return "🔍";
      default:
        return "❌";
    }
  };

  const getErrorTitle = () => {
    switch (type) {
      case "network":
        return "Connection Error";
      case "server":
        return "Server Error";
      case "notfound":
        return "Not Found";
      default:
        return "Something went wrong";
    }
  };

  return (
    <div className="error-container">
      <div className="error-icon">{getErrorIcon()}</div>
      <h3 className="error-title">{getErrorTitle()}</h3>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}