import { useState, useEffect, useRef } from "react";
import "./App.css";

const API = "http://localhost:8000/api/notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then(setNotes);
  }, []);

  function addNote(e) {
    e.preventDefault();
    if (!text.trim()) return;
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then((r) => r.json())
      .then((note) => {
        setNotes([note, ...notes]);
        setText("");
      });
  }

  function deleteNote(id) {
    fetch(`${API}/${id}`, { method: "DELETE" }).then(() =>
      setNotes(notes.filter((n) => n.id !== id))
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Notes</h1>
        <p className="subtitle">
          {notes.length === 1 ? "1 note" : `${notes.length} notes`}
        </p>
      </header>

      <form className="note-form" onSubmit={addNote}>
        <input
          className="note-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a note..."
          autoFocus
        />
        <button className="add-btn" type="submit" disabled={!text.trim()}>
          Add
        </button>
      </form>

      {notes.length === 0 ? (
        <p className="empty-state">
          <span className="empty-icon">~</span>
          <span>No notes yet. Write one above.</span>
        </p>
      ) : (
        <ul className="note-list" ref={listRef}>
          {notes.map((n, i) => (
            <li key={n.id} className="note-card" style={{ animationDelay: `${i * 0.04}s` }}>
              <span className="note-text">{n.text}</span>
              <button
                className="delete-btn"
                onClick={() => deleteNote(n.id)}
                aria-label="Delete note"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;