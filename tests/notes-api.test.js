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
  // If using forEach:
  // Every iteration creates its own async function, so
  // beforeEach cannot wait on forEach to finish executing.

  const new_notes_mapped = init_notes_data.map((note) => new Note(note));
  const new_notes_promises = new_notes_mapped.map((note) => note.save());
  await Promise.all(new_notes_promises); // Fulfill promises (in parallel)

  // If order matters (not parallel):
  // for (let note of init_notes_data) {
  //   let new_note = new Note(note);
  //   await new_note.save();
  // }
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

  test('returns a specific note via its ID', async () => {
    const all_notes = await get_all_notes();
    const first_note = all_notes[0];
    const found_first_note = await api
      .get(`/notes/api/${first_note.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const parsed_note = JSON.parse(JSON.stringify(first_note));
    expect(found_first_note.body).toEqual(parsed_note);
  });

  test('returns status 204 after deleting a note', async () => {
    const all_notes = await get_all_notes();
    const first_note = all_notes[0];
    await api.delete(`/notes/api/${first_note.id}`).expect(204);

    const altered_notes = await get_all_notes();
    expect(altered_notes).toHaveLength(init_notes_data.length - 1);

    const altered_contents = altered_notes.map((r) => r.content);
    expect(altered_contents).not.toContain(first_note.content);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
