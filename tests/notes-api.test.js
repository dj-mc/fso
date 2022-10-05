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

// npm run test -- -t "notes"

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

  test('posts a valid note to mongodb', async () => {
    const new_note = {
      content: 'async-await should be readable syntactic sugar',
      important: true
    };

    await api
      .post('/notes/api')
      .send(new_note)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/notes/api');
    const all_content = response.body.map((r) => r.content);
    expect(response.body).toHaveLength(init_notes_data.length + 1);
    expect(all_content).toContain(
      'async-await should be readable syntactic sugar'
    );
  });
});

afterAll(() => {
  mongoose.connection.close();
});
