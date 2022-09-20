const express = require('express');
const { Note, new_note } = require('./models/Note');
const {
  request_logger,
  unknown_route,
  error_handler
} = require('./middleware');
const cors = require('cors');

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

app.get('/api/:id', (req, res, next) => {
  const target_id = req.params.id;
  Note.findById(target_id)
    .then((found_note) => {
      if (found_note) {
        res.json(found_note);
      } else {
        res.status(400).send(`Couldn't find contact with id: ${target_id}`);
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete('/api/:id', (req, res, next) => {
  const target_id = req.params.id;
  Note.findByIdAndDelete(target_id)
    .then((result) => {
      console.log(`Deleted: ${result}`);
      res.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/api', (req, res, next) => {
  const req_body = req.body;
  if (!req_body.content) {
    return res.status(400).json({ error: 'Content not found' });
  }

  new_note(req_body)
    .save()
    .then((saved_note) => {
      res.json(saved_note);
    })
    .catch((error) => next(error));
});

app.put('/api/:id', (req, res, next) => {
  const req_body = req.body;
  const target_id = req.params.id;
  const updated_note = {
    content: req_body.content,
    important: req_body.important
  };
  Note.findByIdAndUpdate(target_id, updated_note, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then((updated_note_result) => {
      console.log("Toggled note's importance");
      res.json(updated_note_result);
    })
    .catch((error) => next(error));
});

app.use(unknown_route);
app.use(error_handler);

module.exports = { app };
