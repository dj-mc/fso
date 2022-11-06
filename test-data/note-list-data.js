const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: new Date(),
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    date: new Date(),
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: new Date(),
    important: true
  }
];

module.exports = {
  init_notes_data: notes
};
