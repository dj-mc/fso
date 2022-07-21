const fs = require("fs");
const express = require("express");

let notes_data = {};
fs.readFile("./notes.json", "utf8", (err, data) => {
  if (err) throw err;
  notes_data = JSON.parse(data).notes;
  console.log(notes_data);
});

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`<h1>Hello</h1>`);
});

app.get("/api/notes", (req, res) => {
  res.json(notes_data);
});

app.get("/api/notes/:id", (req, res) => {
  const target_note_id = Number(req.params.id);
  const target_note = notes_data.find((note) => note.id === target_note_id);

  if (target_note) {
    res.json(target_note);
  } else {
    res.statusMessage = `Couldn't find note with id: ${target_note_id}`;
    res.status(404).end();
  }
});

app.delete("/api/notes/:id", (req, res) => {
  notes_data = notes_data.filter((note) => note.id !== Number(req.params.id));
  res.status(204).end();
});

const generate_id = () => {
  return notes_data.length > 0
    ? Math.max(notes_data.map((note) => note.id)) + 1
    : 0;
};

app.post("/api/notes", (req, res) => {
  const req_body = req.body;
  if (!req_body.content) {
    return res.status(400).json({ error: "Content not found" });
  }
  const new_note = {
    content: req_body.content,
    important: req_body.important || false,
    date: new Date(),
    id: generate_id(),
  };
  notes_data = notes_data.concat(new_note);
  res.json(new_note);
});

const port = 9001;
app.listen(port);
console.log(`Now listening to ${port}`);
