const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
  username: String,
  name: String,
  password_hash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
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

module.exports = User;
