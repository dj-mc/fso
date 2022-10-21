const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const {
  afterAll,
  beforeEach,
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
  beforeEach(async () => {
    await User.deleteMany({});
    const password_hash = await bcrypt.hash('secret$PW%s@lt3d', 10);
    const new_user = new User({ username: 'root', password_hash });
    await new_user.save();
  });

  test('successfully create a new user', async () => {
    const all_users = await get_all_from_model(User);

    const new_user = {
      username: 'jsmith',
      name: 'Jane Smith',
      password: 'foobar123'
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

    const new_user = {
      username: 'root',
      name: 'imposter superuser',
      password: 'password123'
    };

    const result = await api
      .post('/users/api')
      .send(new_user)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(result.body.error).toContain('This username is already taken');

    const altered_users = await get_all_from_model(User);
    expect(altered_users).toEqual(all_users);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
