const express = require('express');
const jwt = require('jsonwebtoken');
const { Note, new_note } = require('../models/Note');
const { User } = require('../models/User');

const NotesRouter = express.Router();

const get_token_from = (req) => {
  const auth = req.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer')) {
    return auth.substring(7);
  }
  return null;
};

NotesRouter.get('/', (req, res) => {
  res.send(`<h1>Notes Homepage</h1>`);
});

NotesRouter.get('/api', async (req, res) => {
  // see ref: 'User' in ../models/Note.js
  const all_notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  });
  res.json(all_notes);
});

NotesRouter.get('/api/:id', async (req, res, next) => {
  const target_id = req.params.id;
  try {
    const target_note = await Note.findById(target_id);
    if (target_note) {
      res.json(target_note);
    } else {
      res.status(400).send(`Couldn't find contact with id: ${target_id}`);
    }
  } catch (exception) {
    next(exception);
  }
});

NotesRouter.delete('/api/:id', async (req, res, next) => {
  const target_id = req.params.id;
  try {
    await Note.findByIdAndDelete(target_id);
    res.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

NotesRouter.post('/api', async (req, res, next) => {
  const req_body = req.body;
  // const { content, user_id } = req.body;
  const req_token = get_token_from(req);
  const decoded_token = jwt.verify(req_token, process.env.SECRET);

  if (!decoded_token.id) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  if (!req_body.content) {
    return res.status(400).json({ error: 'Content not found' });
  }

  try {
    // user_id is provided in the request object
    // const target_user = await User.findById(req_body.user_id);
    const target_user = await User.findById(decoded_token.id);

    const saved_note = await new_note({
      content: req_body.content,
      user: target_user.id
    }).save();

    target_user.notes = target_user.notes.concat(saved_note.id);
    await target_user.save();
    res.status(201).json(saved_note);
  } catch (exception) {
    next(exception);
  }
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
