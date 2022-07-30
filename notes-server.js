const express = require("express");
const { parse_json_file, overwrite_json_file } = require("./utilities");

let notes_data;
let notes_file_path = "./notes.json";
parse_json_file(notes_file_path).then((result) => {
  notes_data = result.notes;
});

setTimeout(() => {
  console.log("Got data (async):", notes_data);
}, 25);

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`<h1>Notes Homepage</h1>`);
});

app.get("/api", (req, res) => {
  res.json(notes_data);
});

app.get("/api/:id", (req, res) => {
  const target_note_id = Number(req.params.id);
  const target_note = notes_data.find((note) => note.id === target_note_id);

  if (target_note) {
    res.json(target_note);
  } else {
    res.statusMessage = `Couldn't find note with id: ${target_note_id}`;
    res.status(404).end();
  }
});

app.delete("/api/:id", (req, res) => {
  const target_note_id = Number(req.params.id);
  const target_note = notes_data.find((note) => note.id === target_note_id);

  if (target_note) {
    notes_data = notes_data.filter((note) => note.id !== target_note_id);
    overwrite_json_file(notes_file_path, notes_data);
    console.log(`Deletion of ${target_note} successful`);
    res.status(200).end();
  } else {
    res.statusMessage = `Couldn't find note with id: ${target_note_id}`;
    res.status(404).end();
  }
});

app.post("/api", (req, res) => {
  const req_body = req.body;
  if (!req_body.content) {
    return res.status(400).json({ error: "Content not found" });
  }

  const generate_id = () => {
    return notes_data.length > 0
      ? Math.max(notes_data.map((note) => note.id)) + 1
      : 0;
  };

  const new_note = {
    content: req_body.content,
    important: req_body.important || false,
    date: new Date(),
    id: generate_id(),
  };

  notes_data = notes_data.concat(new_note);
  overwrite_json_file(notes_file_path, notes_data);
  res.json(new_note);
});

// const port = 9001;
// function listen() {
//   app.listen(port);
//   console.log(`Now listening to ${port}`);
// }
// listen();

module.exports = { app };
