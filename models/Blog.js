const mongoose = require('mongoose');

const blog_schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return /(?:https?:\/\/)?((\w+[\.\-]?)\w+[\.\-]\w+)\/?.*/g.test(v);
      }
    }
  },
  likes: {
    type: Number,
    required: true
  }
});

blog_schema.set('toJSON', {
  transform: (document, returned_obj) => {
    returned_obj.id = returned_obj._id.toString();
    delete returned_obj._id;
    delete returned_obj.__v;
  }
});

blog_schema.set('toObject', {
  transform: (document, returned_obj) => {
    returned_obj.id = returned_obj._id.toString();
    delete returned_obj._id;
    delete returned_obj.__v;
  }
});

const Blog = mongoose.model('Blog', blog_schema);

const new_blog_post = (req_body) => {
  return new Blog({
    title: req_body.title,
    author: req_body.author,
    url: req_body.url,
    likes: req_body.likes || 0
  });
};

module.exports = { Blog, new_blog_post };
