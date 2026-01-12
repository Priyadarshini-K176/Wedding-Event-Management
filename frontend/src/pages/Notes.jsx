import { useEffect, useState } from "react";
import NoteCard from "../components/NoteCard";
import {
  fetchNotesApi,
  createNoteApi,
  deleteNoteApi,
} from "../services/notesApi";
import "../styles/notes.css";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");

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

  const addNote = async () => {
    if (!text.trim()) return;

    try {
      await createNoteApi({ text });
      setText("");
      loadNotes();
    } catch (err) {
      alert("Failed to save note");
      console.error(err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await deleteNoteApi(id);
      loadNotes();
    } catch (err) {
      console.error("Delete failed:", err);
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
        <button onClick={addNote}>+ Add Note</button>
      </div>

      {notes.length === 0 ? (
        <div className="empty-state">
          <h3>No notes yet</h3>
          <p>Add reminders, ideas, or tasks here.</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} onDelete={deleteNote} />
          ))}
        </div>
      )}
    </>
  );
}
