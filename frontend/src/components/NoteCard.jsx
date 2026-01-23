import { useState } from "react";

export default function NoteCard({ note, onDelete, onEdit }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="note-card">
      <p className="note-text">{note.text}</p>

      <div className="note-footer">
        <span className="note-date">
          {new Date(note.createdAt).toLocaleDateString([], {
            day: "2-digit",
            month: "short",
          })}
        </span>

        <div className="note-actions">
          <div className="note-menu">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="note-btn menu-btn"
              title="Options"
            >
              ⋯
            </button>
            {showMenu && (
              <div className="menu-dropdown">
                <button onClick={() => { onEdit(note); setShowMenu(false); }}>Edit</button>
                <button onClick={() => { onDelete(note._id); setShowMenu(false); }}>Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}