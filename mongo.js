require('dotenv').config();
const mongoose = require('mongoose');
const { Note, save_new_note, Contact, save_new_contact } = require('./models');

// CLI to mongodb
// node mongo.js notes <data>
// node mongo.js phonebook <data>

if (process.argv.length < 3) {
  console.log('Missing arguments? Try: node mongo.js <db> <data>');
  process.exit(1);
}

const mongodb_uri = process.env.MONGODB_URI;
const db = process.argv[2]; // Expecting notes or phonebook
// Expecting a quoted JSON string eg '{"data":42, "error":true}'
const json_data = JSON.parse(process.argv[3]);

mongoose
  .connect(mongodb_uri)

  .then((_) => {
    console.log('Connected to mongoose.');
    switch (db) {
      case 'notes':
        return save_new_note(json_data);
      case 'phonebook':
        return save_new_contact(json_data);
      default:
        return () => {
          console.log(`Couldn't find ${db}`);
          process.exit(1);
        };
    }
  })

  .then(() => {
    Note.find({}).then((result) => {
      result.forEach((note) => {
        console.log(note);
      });
    });
    Contact.find({}).then((result) => {
      result.forEach((contact) => {
        console.log(contact);
      });
    });

    return mongoose.connection.close();
  })
  .catch((err) => console.error(err));
