require('dotenv').config();
const mongoose = require('mongoose');
const { Note, new_note } = require('./models/Note');
const { Contact, new_contact } = require('./models/Contact');
const { Blog, new_blog_listing } = require('./models/Blog');

// CLI to mongodb
// node mongo.js notes <data>
// node mongo.js phonebook <data>
// node mongo.js blog <data>

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
    new_note(json_data).save();
    Note.find({}).then((result) => {
      result.forEach((note) => {
        console.log(note);
      });
      mongoose.connection.close();
    });
    break;

  case 'phonebook':
    new_contact(json_data).save();
    Contact.find({}).then((result) => {
      result.forEach((contact) => {
        console.log(contact);
      });
      mongoose.connection.close();
    });
    break;

  case 'blog':
    new_blog_listing(json_data).save();
    Blog.find({}).then((result) => {
      result.forEach((listing) => {
        console.log(listing);
      });
      mongoose.connection.close();
    });
    break;

  default:
    console.log(`Couldn't find ${db}`);
    process.exit(1);
}
