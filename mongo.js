require('dotenv').config();
const mongoose = require('mongoose');
const Note = require('./models/Note');
const Contact = require('./models/Contact');

// CLI to mongodb
// node mongo.js notes <data>
// node mongo.js phonebook <data>

if (process.argv.length < 3) {
  console.log('Missing arguments? Try: node mongo.js <db> <data>');
  process.exit(1);
}

const mongodb_URI = process.env.MONGODB_URI;
const db = process.argv[2]; // Expecting notes or phonebook
// Expecting a quoted JSON string e.g. '{"data":42, "error":true}'
const json_data = JSON.parse(process.argv[3]);

mongoose
  .connect(mongodb_URI)
  .then((_) => {
    console.log(`Connected to ${mongodb_URI}`);
  })
  .catch((error) => {
    console.log(error.message);
  });

switch (db) {
  case 'notes':
    const new_note = new Note({
      content: json_data.content,
      date: new Date(),
      important: json_data.important || false
    });
    new_note.save();
    Note.find({}).then((result) => {
      result.forEach((note) => {
        console.log(note);
      });
      mongoose.connection.close();
    });
    break;

  case 'phonebook':
    const new_contact = new Contact({
      name: json_data.name,
      phone_number: json_data.phone_number
    });
    new_contact.save();
    Contact.find({}).then((result) => {
      result.forEach((contact) => {
        console.log(contact);
      });
      mongoose.connection.close();
    });
    break;

  default:
    console.log(`Couldn't find ${db}`);
    process.exit(1);
}
