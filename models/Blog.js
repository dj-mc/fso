const mongoose = require('mongoose');

const blog_schema = new mongoose.Schema({
  title: String,
  author: String,
  url: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return /(?:https?:\/\/)?((\w+[\.\-]?)\w+[\.\-]\w+)\/?.*/g.test(v);
      }
    }
  },
  likes: Number
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

const new_blog_listing = (req_body) => {
  return new Blog({
    title: req_body.title,
    author: req_body.author,
    url: req_body.url,
    likes: req_body.likes
  });
};

module.exports = { Blog, new_blog_listing };