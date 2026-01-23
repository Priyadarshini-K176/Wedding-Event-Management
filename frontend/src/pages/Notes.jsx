import { useEffect, useState } from "react";
import NoteCard from "../components/NoteCard";
import {
  fetchNotesApi,
  createNoteApi,
  updateNoteApi,
  deleteNoteApi,
} from "../services/notesApi";
import "../styles/notes.css";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadNotes = async () => {
    try {
      const res = await fetchNotesApi();
      const data = res.data?.data || [];
      setNotes(data);
    } catch (err) {
      console.error("Failed to load notes:", err);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const addOrUpdateNote = async () => {
    if (!text.trim()) return;

    try {
      setIsSubmitting(true);
      if (editingNote) {
        // Update existing note
        await updateNoteApi(editingNote._id, { text });
        setEditingNote(null);
      } else {
        // Create new note
        await createNoteApi({ text });
      }
      setText("");
      loadNotes();
    } catch (err) {
      alert("Failed to save note");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setText(note.text);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setText("");
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await deleteNoteApi(id);
      loadNotes();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete note");
    }
  };

  return (
    <>
      <h1 className="page-title">Notes</h1>

      <div className="note-input-card">
        <textarea
          placeholder="Write something important..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="note-input-actions">
          <button 
            onClick={addOrUpdateNote}
            disabled={isSubmitting}
          >
            {isSubmitting ? (editingNote ? "Updating..." : "Adding...") : (editingNote ? "Update Note" : "+ Add Note")}
          </button>
          {editingNote && (
            <button 
              onClick={handleCancelEdit}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="empty-state">
          <h3>No notes yet</h3>
          <p>Add reminders, ideas, or tasks here.</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <NoteCard 
              key={note._id} 
              note={note} 
              onDelete={deleteNote}
              onEdit={handleEditNote}
            />
          ))}
        </div>
      )}
    </>
  );
}
