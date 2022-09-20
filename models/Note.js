require('dotenv').config();
const mongoose = require('mongoose');
const mongodb_URI = process.env.MONGODB_URI;

mongoose
  .connect(mongodb_URI)
  .then((_) => {
    console.log(`Connected to ${mongodb_URI}`);
  })
  .catch((error) => {
    console.log(error.message);
  });

const note_schema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  date: { type: Date, required: true },
  important: { type: Boolean }
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
    important: req_body.important || false
  });
};

module.exports = { Note, new_note };
