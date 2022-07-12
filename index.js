const express = require("express");

const app = express();
app.use(express.json());

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true,
  },
];

app.get("/", (req, res) => {
  res.send(`<h1>Hello</h1>`);
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const target_note_id = Number(req.params.id);
  const target_note = notes.find((note) => note.id === target_note_id);

  if (target_note) {
    res.json(target_note);
  } else {
    res.statusMessage = `Couldn't find note with id: ${target_note_id}`;
    res.status(404).end();
  }
});

app.delete("/api/notes/:id", (req, res) => {
  notes = notes.filter((note) => note.id !== Number(req.params.id));
  res.status(204).end();
});

app.post("/api/notes", (req, res) => {
  const note = req.body;
  console.log(note);
  res.json(note);
});

const port = 9001;
app.listen(port);
console.log(`Now listening to ${port}`);
