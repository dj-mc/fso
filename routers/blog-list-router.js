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

BlogRouter.post('/api', (req, res) => {
  new_blog_listing(req.body)
    .save()
    .then((saved_blog_listing) => {
      res.status(201).json(saved_blog_listing);
    });
});

module.exports = { app: BlogRouter };
