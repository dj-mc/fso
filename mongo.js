const mongoose = require('mongoose');

// node mongo.js <password> notes <data>
// node mongo.js <password> phonebook <data>

if (process.argv.length < 4) {
  console.log('Missing arguments? Try: node mongo.js <password> <db> <data>');
  process.exit(1);
}

const password = process.argv[2];
const mongodb_url = `mongodb+srv://dj-mc:${password}@cluster0.at72vrm.mongodb.net/?retryWrites=true&w=majority`;

const db = process.argv[3]; // Expecting notes or phonebook
// Expecting a quoted JSON string eg '{"data":42, "error":true}'
const json_data = JSON.parse(process.argv[4]);

const note_schema = new mongoose.Schema({
  content: { type: String },
  date: { type: Date },
  important: { type: Boolean }
});
const Note = mongoose.model('Note', note_schema);

const contact_schema = new mongoose.Schema({
  name: { type: String },
  phone_number: { type: String },
  id: { type: Number }
});
const Contact = mongoose.model('Contact', contact_schema);

const save_new_note = () => {
  const new_date = new Date(Date.now());
  const new_note = new Note({
    ...json_data,
    date: json_data.date || new_date.toISOString(),
    important: json_data.important || false
  });
  return new_note.save();
};

const save_new_contact = () => {
  const new_contact = new Contact({
    ...json_data,
    id: json_data.id || Math.random() * 10e16
  });
  return new_contact.save();
};

mongoose
  .connect(mongodb_url)

  .then((result) => {
    console.log(`Connected to mongoose. Result: ${result}`);
    switch (db) {
      case 'notes':
        return save_new_note();
      case 'phonebook':
        return save_new_contact();
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
