const express = require('express');
const { Note, new_note } = require('../models/Note');

const NotesRouter = express.Router();

NotesRouter.get('/', (req, res) => {
  res.send(`<h1>Notes Homepage</h1>`);
});

NotesRouter.get('/api', async (req, res) => {
  const all_notes = await Note.find({});
  res.json(all_notes);
});

NotesRouter.get('/api/:id', (req, res, next) => {
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

NotesRouter.delete('/api/:id', (req, res, next) => {
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

NotesRouter.post('/api', (req, res, next) => {
  const req_body = req.body;
  if (!req_body.content) {
    return res.status(400).json({ error: 'Content not found' });
  }

  new_note(req_body)
    .save()
    .then((saved_note) => {
      res.status(201).json(saved_note);
    })
    .catch((error) => next(error));
});

NotesRouter.put('/api/:id', (req, res, next) => {
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

module.exports = { app: NotesRouter };
