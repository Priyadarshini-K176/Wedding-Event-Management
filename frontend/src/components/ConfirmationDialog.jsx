import "../styles/confirmation.css";

export default function ConfirmationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  eventDetails,
  confirmText = "Delete",
  cancelText = "Cancel" 
}) {
  if (!isOpen) return null;

  return (
    <div className="confirmation-backdrop" onClick={onClose}>
      <div className="confirmation-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-icon">⚠️</div>
        <h3 className="confirmation-title">{title}</h3>
        <p className="confirmation-message">{message}</p>
        
        {eventDetails && (
          <div className="event-details">
            <h4>{eventDetails.title}</h4>
            <p>{new Date(eventDetails.startTime).toLocaleDateString()} at {new Date(eventDetails.startTime).toLocaleTimeString()}</p>
            {eventDetails.eventType && <span className="event-type">{eventDetails.eventType}</span>}
          </div>
        )}
        
        <div className="confirmation-actions">
          <button className="cancel-btn" onClick={onClose}>
            {cancelText}
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}