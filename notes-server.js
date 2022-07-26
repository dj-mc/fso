const fs = require("fs");
const express = require("express");

let notes_data = [];
fs.readFile("./notes.json", "utf8", (err, data) => {
  if (err) throw err;
  else notes_data = notes_data.concat(JSON.parse(data).notes);
});

const overwrite_local_db = (json_data) => {
  fs.writeFile("./notes.json", JSON.stringify(json_data), "utf8", (err) => {
    if (err) throw err;
    else console.log(`Saved ${json_data}!`);
  });
};

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
    overwrite_local_db(notes_data);
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
  overwrite_local_db(notes_data);
  res.json(new_note);
});

const port = 9001;

function listen() {
  app.listen(port);
  console.log(`Now listening to ${port}`);
}

// listen();

module.exports = { app };
