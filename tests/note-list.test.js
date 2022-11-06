const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const {
  afterAll,
  beforeAll,
  describe,
  expect,
  test
} = require('@jest/globals');
const supertest = require('supertest');
const { Note } = require('../models/Note');
const { User } = require('../models/User');
const { get_all_from_model } = require('./test-helper');
const { init_notes_data } = require('../test-data/note-list-data.js');

// npm run test -- -t "notes"

const app = require('../app');
// Let supertest serve the testing suite
const api = supertest(app);

describe('get /notes/api', () => {
  beforeAll(async () => {
    await Note.deleteMany({});
    await Note.insertMany(init_notes_data);
  });

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

  test('returns a specific note via its ID', async () => {
    const all_notes = await get_all_from_model(Note);
    const first_note = all_notes[0];
    const found_first_note = await api
      .get(`/notes/api/${first_note.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const parsed_note = JSON.parse(JSON.stringify(first_note));
    expect(found_first_note.body).toEqual(parsed_note);
  });
});

describe('post /notes/api', () => {
  let token;

  beforeAll(async () => {
    await Note.deleteMany({});
    await User.deleteMany({});

    // Create a new user
    const password_hash = await bcrypt.hash('qwerty121', 10);
    const new_user = new User({
      username: 'jdoe',
      name: 'John Doe',
      password_hash
    });

    await new_user.save();
  });

  test('posts a valid note to database', async () => {
    // Login with previously defined new_user
    const login_response = await api
      .post('/login/api')
      .send({ username: 'jdoe', password: 'qwerty121' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    token = login_response.body.token;

    const new_note = {
      content: 'async-await should be readable syntactic sugar',
      username: 'jdoe'
    };

    await api
      .post('/notes/api')
      .set('Authorization', 'Bearer ' + token)
      .send(new_note)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const all_notes = await get_all_from_model(Note);
    expect(all_notes).toHaveLength(1);

    const all_content = all_notes.map((r) => r.content);
    expect(all_content).toContain(
      'async-await should be readable syntactic sugar'
    );
  });

  test('refuses to post empty note content', async () => {
    const new_note = {
      important: true,
      username: 'jdoe'
    };

    await api
      .post('/notes/api')
      .set('Authorization', 'Bearer ' + token)
      .send(new_note)
      .expect(400);

    const all_notes = await get_all_from_model(Note);
    expect(all_notes).toHaveLength(1);
  });
});

describe('delete /notes/api', () => {
  beforeAll(async () => {
    await Note.deleteMany({});
    await Note.insertMany(init_notes_data);
  });

  test('returns status 204 after deleting a note', async () => {
    const all_notes = await get_all_from_model(Note);
    const first_note = all_notes[0];
    await api.delete(`/notes/api/${first_note.id}`).expect(204);

    const altered_notes = await get_all_from_model(Note);
    expect(altered_notes).toHaveLength(all_notes.length - 1);

    const altered_contents = altered_notes.map((r) => r.content);
    expect(altered_contents).not.toContain(first_note.content);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
