const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
  username: { type: String, minLength: 3, required: true },
  name: { type: String, minLength: 3, required: true },
  password_hash: { type: String, required: true },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
});

user_schema.set('toJSON', {
  transform: (document, returned_obj) => {
    returned_obj.id = returned_obj._id.toString();
    delete returned_obj._id;
    delete returned_obj.__v;
    // Do not reveal password_hash
    delete returned_obj.password_hash;
  }
});

user_schema.set('toObject', {
  transform: (document, returned_obj) => {
    returned_obj.id = returned_obj._id.toString();
    delete returned_obj._id;
    delete returned_obj.__v;
    // Do not reveal password_hash
    delete returned_obj.password_hash;
  }
});

const User = mongoose.model('User', user_schema);

const new_user = (req_body) => {
  return new User({
    username: req_body.username,
    name: req_body.name,
    password_hash: req_body.password_hash
  });
};

module.exports = { User, new_user };
