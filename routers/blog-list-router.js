const express = require('express');
const jwt = require('jsonwebtoken');
const { Blog, new_blog_post } = require('../models/Blog');
const { User } = require('../models/User');

const BlogRouter = express.Router();

BlogRouter.get('/', (req, res) => {
  res.send('<h1>Blog List</h1>');
});

BlogRouter.get('/api', async (req, res) => {
  // see ref: 'User' in ../models/Blog.js
  const blog_list = await Blog.find({}).populate('user', {
    username: 1,
    name: 1
  });
  res.json(blog_list);
});

BlogRouter.post('/api', async (req, res, next) => {
  const req_body = req.body;
  const req_token = req.token;
  const decoded_token = jwt.verify(req_token, process.env.SECRET);

  if (!decoded_token.id) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  try {
    const target_user = await User.findById(decoded_token.id);

    const saved_blog_post = await new_blog_post({
      title: req_body.title,
      author: req_body.author,
      url: req_body.url,
      likes: req_body.likes,
      user: target_user
    }).save();

    target_user.blogs = target_user.blogs.concat(saved_blog_post.id);
    await target_user.save();

    res.status(201).json(saved_blog_post);
  } catch (exception) {
    next(exception);
  }
});

BlogRouter.delete('/api/:id', async (req, res, next) => {
  const req_token = req.token;
  const decoded_token = jwt.verify(req_token, process.env.SECRET);

  if (!decoded_token.id) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const target_id = req.params.id;

  try {
    const target_blog = await Blog.findById(target_id);
    const target_user = await User.findById(decoded_token.id);
    if (target_blog.user.toString() === target_user.id.toString()) {
      await Blog.findByIdAndDelete(target_id);
      res.status(204).end();
    } else {
      return res.status(403).json({
        error: 'User does not have permission to delete this blog post'
      });
    }
  } catch (exception) {
    next(exception);
  }
});

BlogRouter.put('/api/:id', async (req, res, next) => {
  const req_body = req.body;
  const target_id = req.params.id;

  try {
    const target_blog_post = await Blog.findById(target_id);
    const updated_blog_post = {
      ...target_blog_post.toJSON(),
      likes: req_body.likes
    };

    const updated_blog_result = await Blog.findByIdAndUpdate(
      target_id,
      updated_blog_post,
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    );

    console.log("Updated blog's likes count");
    res.json(updated_blog_result);
  } catch (exception) {
    next(exception);
  }
});

module.exports = { app: BlogRouter };
