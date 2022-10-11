const { Note } = require('../models/Note');

const get_all_notes = async () => {
  const notes = await Note.find({});
  return notes.map((note) => note.toJSON());
};

const non_existent_id = async () => {
  const note = new Note({ content: 'asdfghjkl;', date: new Date() });
  await note.save();
  await note.remove();
  return note.id.toString();
};

module.exports = {
  get_all_notes,
  non_existent_id
};
