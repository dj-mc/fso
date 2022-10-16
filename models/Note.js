const mongoose = require('mongoose');

const note_schema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  date: { type: Date, required: true },
  important: { type: Boolean },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

note_schema.set('toJSON', {
  transform: (document, returned_obj) => {
    returned_obj.id = returned_obj._id.toString();
    delete returned_obj._id;
    delete returned_obj.__v;
  }
});

note_schema.set('toObject', {
  transform: (document, returned_obj) => {
    returned_obj.id = returned_obj._id.toString();
    delete returned_obj._id;
    delete returned_obj.__v;
  }
});

const Note = mongoose.model('Note', note_schema);

const new_note = (req_body) => {
  return new Note({
    content: req_body.content,
    date: new Date(),
    important: req_body.important || false,
    user: req_body.user
  });
};

module.exports = { Note, new_note };
