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
const { get_all_notes, init_notes_data } = require('./test-helper');

// npm run test -- -t "notes"

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

  test('contains a specifically added note', async () => {
    const response = await api.get('/notes/api');
    const contents = response.body.map((note) => note.content);
    expect(contents).toContain('Browser can execute only JavaScript');
  });

  test('posts a valid note to database', async () => {
    const new_note = {
      content: 'async-await should be readable syntactic sugar',
      important: true
    };

    await api
      .post('/notes/api')
      .send(new_note)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const all_notes = await get_all_notes();
    expect(all_notes).toHaveLength(init_notes_data.length + 1);

    const all_content = all_notes.map((r) => r.content);
    expect(all_content).toContain(
      'async-await should be readable syntactic sugar'
    );
  });

  test('refuses to post empty note content', async () => {
    const new_note = {
      important: true
    };

    await api.post('/notes/api').send(new_note).expect(400);

    const all_notes = await get_all_notes();
    expect(all_notes).toHaveLength(init_notes_data.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
