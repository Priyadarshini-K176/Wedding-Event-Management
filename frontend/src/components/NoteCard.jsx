export default function NoteCard({ note, onDelete }) {
  return (
    <div className="note-card">
      <p className="note-text">{note.text}</p>

      <div className="note-footer">
        <span>
          {new Date(note.createdAt).toLocaleDateString([], {
            day: "2-digit",
            month: "short",
          })}
        </span>

        <button onClick={() => onDelete(note._id)} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
}
