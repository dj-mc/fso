const express = require('express');
const { Blog, new_blog_listing } = require('../models/Blog');

const BlogRouter = express.Router();

BlogRouter.get('/', (req, res) => {
  res.send('<h1>Blog List</h1>');
});

BlogRouter.get('/api', async (req, res) => {
  const blog_list = await Blog.find({});
  res.json(blog_list);
});

BlogRouter.post('/api', async (req, res, next) => {
  try {
    const saved_blog_listing = await new_blog_listing(req.body).save();
    res.status(201).json(saved_blog_listing);
  } catch (exception) {
    next(exception);
  }
});

BlogRouter.delete('/api/:id', async (req, res, next) => {
  const target_id = req.params.id;
  try {
    await Blog.findByIdAndDelete(target_id);
    res.status(204).end();
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
