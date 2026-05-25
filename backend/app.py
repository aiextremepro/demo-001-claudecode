import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
DB = "notes.db"


def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    conn.execute("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL)")
    conn.commit()
    return conn


@app.route("/api/notes", methods=["GET"])
def list_notes():
    conn = get_db()
    rows = conn.execute("SELECT id, text FROM notes ORDER BY id DESC").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/notes", methods=["POST"])
def add_note():
    data = request.get_json()
    if not data or not data.get("text", "").strip():
        return jsonify({"error": "text required"}), 400
    conn = get_db()
    cur = conn.execute("INSERT INTO notes (text) VALUES (?)", (data["text"].strip(),))
    conn.commit()
    note = {"id": cur.lastrowid, "text": data["text"].strip()}
    conn.close()
    return jsonify(note), 201


@app.route("/api/notes/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    conn = get_db()
    cur = conn.execute("DELETE FROM notes WHERE id = ?", (note_id,))
    conn.commit()
    conn.close()
    if cur.rowcount == 0:
        return jsonify({"error": "not found"}), 404
    return jsonify({"ok": True}), 200


if __name__ == "__main__":
    app.run(port=8000, debug=True)
