const mongoose = require('mongoose');
const {
  afterAll,
  beforeEach,
  describe,
  expect,
  test
} = require('@jest/globals');
const supertest = require('supertest');
const { Note } = require('../models/Note');

const init_notes_data = [
  { content: 'HTML is easy', date: new Date(), important: false },
  {
    content: 'Browser can execute only JavaScript',
    date: new Date(),
    important: true
  }
];

beforeEach(async () => {
  await Note.deleteMany({});
  let new_note = new Note(init_notes_data[0]);
  await new_note.save();
  new_note = new Note(init_notes_data[1]);
  await new_note.save();
});

const app = require('../app');
// Let supertest serve the testing suite
const api = supertest(app);

describe('/notes/api', () => {
  test('returns correct json', async () => {
    await api
      .get('/notes/api') // Not closing?
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('returns correct schema', async () => {
    const response = await api.get('/notes/api');
    expect(Object.keys(response.body[0])).toStrictEqual([
      'content',
      'date',
      'important',
      'id'
    ]);
  });

  test('returns all notes in database', async () => {
    const response = await api.get('/notes/api');
    expect(response.body).toHaveLength(init_notes_data.length);
  });

  test('returns a single, specified note', async () => {
    const response = await api.get('/notes/api');
    const contents = response.body.map((note) => note.content);
    expect(contents).toContain('Browser can execute only JavaScript');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
