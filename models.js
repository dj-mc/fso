require('dotenv').config();
const mongoose = require('mongoose');
const mongodb_url = process.env.MONGODB_URI;

mongoose
  .connect(mongodb_url)
  .then((_) => {
    console.log(`Connected to ${mongodb_url}`);
  })
  .catch((error) => {
    console.log(error.message);
  });

const note_schema = new mongoose.Schema({
  content: { type: String },
  date: { type: Date },
  important: { type: Boolean }
});

note_schema.set('toJSON', {
  transform: (document, returned_obj) => {
    returned_obj.id = returned_obj._id.toString();
    delete returned_obj._id;
    delete returned_obj.__v;
  }
});

const Note = mongoose.model('Note', note_schema);

const contact_schema = new mongoose.Schema({
  name: { type: String },
  phone_number: { type: String },
  id: { type: Number }
});

const Contact = mongoose.model('Contact', contact_schema);

const save_new_note = (input_json_data) => {
  const new_date = new Date(Date.now());
  const new_note = new Note({
    ...input_json_data,
    date: input_json_data.date || new_date.toISOString(),
    important: input_json_data.important || false
  });
  return new_note.save();
};

const save_new_contact = (input_json_data) => {
  const new_contact = new Contact({
    ...input_json_data,
    id: input_json_data.id || Math.random() * 10e16
  });
  return new_contact.save();
};

module.exports = { Note, save_new_note, Contact, save_new_contact };
