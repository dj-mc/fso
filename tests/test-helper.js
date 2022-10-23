const { Note } = require('../models/Note');

const get_all_from_model = async (model) => {
  const all_data = await model.find({});
  return all_data.map((data) => data.toJSON());
};

const non_existent_id = async () => {
  const note = new Note({ content: 'asdfghjkl;', date: new Date() });
  await note.save();
  await note.remove();
  return note.id.toString();
};

module.exports = {
  get_all_from_model,
  non_existent_id
};
