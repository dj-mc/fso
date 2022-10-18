const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const AuthRouter = express.Router();

AuthRouter.post('/api', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const target_user = await User.findOne({ username });
    const password_correct =
      target_user === null
        ? false
        : await bcrypt.compare(password, target_user.password_hash);

    if (!(target_user && password_correct)) {
      return res.status(401).json({
        error: 'Invalid username or password'
      });
    }

    const user_for_token = {
      username: target_user.username,
      id: target_user.id
    };

    const token = jwt.sign(user_for_token, process.env.SECRET);

    res.status(200).send({
      token,
      username: target_user.username,
      name: target_user.name
    });
  } catch (exception) {
    next(exception);
  }
});

module.exports = { app: AuthRouter };
