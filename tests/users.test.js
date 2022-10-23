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
const { User } = require('../models/User');
const { get_all_from_model } = require('../tests/test-helper');

const app = require('../app');
const api = supertest(app);

describe('If there is one user in database', () => {
  beforeAll(async () => {
    await User.deleteMany({});
    const password_hash = await bcrypt.hash('secret$PW%s@lt3d', 10);
    const new_user = new User({
      username: 'root',
      name: 'mega admin superuser extreme version 2.0',
      password_hash // Model takes hash of pw, not its plaintext
    });
    await new_user.save();
  });

  test('successfully create a new user', async () => {
    const all_users = await get_all_from_model(User);

    const new_user = {
      username: 'jsmith',
      name: 'Jane Smith',
      password: 'foobar123' // API takes plaintext pw
    };

    await api
      .post('/users/api')
      .send(new_user)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const altered_users = await get_all_from_model(User);
    expect(altered_users).toHaveLength(all_users.length + 1);

    const usernames = altered_users.map((user) => user.username);
    expect(usernames).toContain(new_user.username);
  });

  test('fail to create a new user whose username is already taken', async () => {
    const all_users = await get_all_from_model(User);

    const duplicate_user = {
      username: 'root',
      name: 'imposter superuser',
      password: 'password123'
    };

    const result = await api
      .post('/users/api')
      .send(duplicate_user)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(result.body.error).toContain('This username is already taken');

    const altered_users = await get_all_from_model(User);
    expect(altered_users).toEqual(all_users);
  });

  test('fail to create a new user whose credentials are invalid', async () => {
    const invalid_user = {
      username: 'jo',
      name: 'jo',
      password: 'four'
    };

    await api
      .post('/users/api')
      .send(invalid_user)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
