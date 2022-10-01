const mongoose = require('mongoose');
const { afterAll, test } = require('@jest/globals');
const supertest = require('supertest');

const app = require('../app');
const api = supertest(app);

test('/notes/api returns correct json', async () => {
  await api
    .get('/notes/api')
    .expect(200)
    .expect('Content-Type', /application\/json/);
}, 10000);

afterAll(() => {
  mongoose.connection.close();
});
