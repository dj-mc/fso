const bcrypt = require('bcrypt');
const express = require('express');
const { User, new_user } = require('../models/User');

const UsersRouter = express.Router();

// Validate that
// - username is long enough
// - username only consists of permitted characters
// - password is strong enough

UsersRouter.get('/', (req, res) => {
  res.send(`<h1>Users Homepage</h1>`);
});

UsersRouter.get('/api', async (req, res) => {
  // see ref: 'Note' in ../models/User.js
  const all_users = await User.find({})
    .populate('notes', {
      content: 1,
      date: 1
    })
    .populate('blogs', {
      title: 1,
      author: 1,
      url: 1
    });
  res.json(all_users);
});

UsersRouter.post('/api', async (req, res, next) => {
  const { username, name, password } = req.body;

  if (password.length < 9) {
    return res.status(400).json({
      error: 'Password requires at least 9 characters'
    });
  }

  try {
    const existing_user = await User.findOne({ username });
    if (existing_user) {
      return res.status(400).json({
        error: 'This username is already taken'
      });
    }

    const saltings = 10; // Add more salt if Moore's law is a concern
    // bcrypt's "slow work" ensures hashes cannot be easily cracked
    const password_hash = await bcrypt.hash(password, saltings);

    const saved_user = await new_user({
      username,
      name,
      password_hash
    }).save();

    res.status(201).json(saved_user);
  } catch (exception) {
    next(exception);
  }
});

module.exports = { app: UsersRouter };
