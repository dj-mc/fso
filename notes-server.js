const express = require('express');
// const { parse_json_file, overwrite_json_file } = require('./utilities');
const { request_logger, unknown_route } = require('./middleware');
const cors = require('cors');
const { Note } = require('./models');

// Replace local json file IO with mongo api.
// Instead use local json file IO as import/export backup
// functionality for end user.

// let notes_data = [];
// const notes_file_path = './notes.json';
// parse_json_file(notes_file_path).then((result) => {
//   notes_data = notes_data.concat(result.notes);
// });

const app = express();
app.use(express.json());
app.use(request_logger);
app.use(cors());

app.get('/', (req, res) => {
  res.send(`<h1>Notes Homepage</h1>`);
});

app.get('/api', (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.get('/api/:id', (req, res) => {
  Note.findById(req.params.id).then((found_note) => {
    res.json(found_note);
  });

  // const target_note_id = Number(req.params.id);
  // const target_note = notes_data.find((note) => note.id === target_note_id);

  // if (target_note) {
  //   res.json(target_note);
  // } else {
  //   res.statusMessage = `Couldn't find note with id: ${target_note_id}`;
  //   res.status(404).end();
  // }
});

app.delete('/api/:id', (req, res) => {
  // const target_note_id = Number(req.params.id);
  // const target_note = notes_data.find((note) => note.id === target_note_id);
  // if (target_note) {
  //   notes_data = notes_data.filter((note) => note.id !== target_note_id);
  //   // overwrite_json_file(notes_file_path, { notes: notes_data });
  //   console.log(`Deletion of ${target_note} successful`);
  //   res.status(200).end();
  // } else {
  //   res.statusMessage = `Couldn't find note with id: ${target_note_id}`;
  //   res.status(404).end();
  // }
});

app.post('/api', (req, res) => {
  const req_body = req.body;
  if (!req_body.content) {
    return res.status(400).json({ error: 'Content not found' });
  }

  // const generate_id = () => {
  //   return notes_data.length > 0
  //     ? Math.max(notes_data.map((note) => note.id)) + 1
  //     : 0;
  // };

  const new_note = new Note({
    content: req_body.content,
    important: req_body.important || false,
    date: new Date()
    // id: generate_id()
  });

  // notes_data = notes_data.concat(new_note);
  // overwrite_json_file(notes_file_path, { notes: notes_data });
  new_note.save().then((saved_note) => {
    res.json(saved_note);
  });
});

app.use(unknown_route);

module.exports = { app };
