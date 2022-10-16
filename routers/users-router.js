const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/User');

const UsersRouter = express.Router();

// Validate that
// - username is long enough
// - username only consists of permitted characters
// - password is strong enough

UsersRouter.post('/api', async (req, res, next) => {
  const { username, name, password } = req.body;
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

    const new_user = new User({
      username,
      name,
      password_hash
    });

    const saved_user = await new_user.save();
    res.status(201).json(saved_user);
  } catch (exception) {
    next(exception);
  }
});

module.exports = { app: UsersRouter };
