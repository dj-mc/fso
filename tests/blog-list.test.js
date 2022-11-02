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
const { Blog } = require('../models/Blog');
const { User } = require('../models/User');
const { get_all_from_model } = require('../tests/test-helper');
const init_blog_list = require('../test-data/blog-list.json').blogs;
const { total_likes, favorite_blog } = require('../utils/blog-list-helper');

const app = require('../app');
const api = supertest(app);

describe('get /blogs/api', () => {
  beforeAll(async () => {
    await Blog.deleteMany({});
    for (const blog of init_blog_list) {
      const new_blog = new Blog(blog);
      await new_blog.save();
    }
  });

  test('returns the correct amount of blog posts in JSON format', async () => {
    const response = await api.get('/blogs/api');
    expect(response.body).toHaveLength(init_blog_list.length);
  });

  test('returns blog posts, each containing a unique id property', async () => {
    const response = await api.get('/blogs/api');
    for (const blog of response.body) {
      expect(blog.id).toBeDefined();
    }
  });
});

let token; // The rest of the tests focus on user rrob and his posts

describe('post /blogs/api', () => {
  beforeAll(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    // Create a new user
    const password_hash = await bcrypt.hash('qwerty121', 10);
    const new_user = new User({
      username: 'rrob',
      name: 'Robert Robertson',
      password_hash
    });

    await new_user.save();
  });

  test('posts a valid blog post to database', async () => {
    // Login with previously defined new_user
    const login_response = await api
      .post('/login/api')
      .send({ username: 'rrob', password: 'qwerty121' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    token = login_response.body.token;

    const new_blog = {
      title: 'title of blog post',
      author: 'author of blog post',
      url: 'https://url.123/blog',
      likes: 3,
      username: 'rrob'
    };

    await api
      .post('/blogs/api')
      .set('Authorization', 'Bearer ' + token)
      .send(new_blog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const all_blogs = await get_all_from_model(Blog);
    expect(all_blogs).toHaveLength(1); // First blog posted
  });

  test('posts a blog post with no likes property to database', async () => {
    const new_blog = {
      title: 'Programming Programs',
      author: 'Programmer',
      url: 'https://foo.369/vlog',
      username: 'rrob'
    };

    await api
      .post('/blogs/api')
      .set('Authorization', 'Bearer ' + token)
      .send(new_blog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const all_blogs = await get_all_from_model(Blog);
    expect(all_blogs).toHaveLength(2); // Second blog posted
  });

  test('returns status code 400 if new_blog has no title or url', async () => {
    const new_blog = {
      author: 'John Doe',
      likes: 999,
      username: 'rrob'
    };

    await api
      .post('/blogs/api')
      .set('Authorization', 'Bearer ' + token)
      .send(new_blog)
      .expect(400);
  });
});

describe('delete /blogs/api', () => {
  test('returns status code 204 after deleting a blog post', async () => {
    const all_blogs = await get_all_from_model(Blog);
    const first_blog = all_blogs[0];

    await api
      .delete(`/blogs/api/${first_blog.id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204);

    const altered_blog_list = await get_all_from_model(Blog);
    expect(altered_blog_list).toHaveLength(all_blogs.length - 1);
  });
});

describe('update /blogs/api', () => {
  test('return status code 200 after updating a blog post', async () => {
    const all_blogs = await get_all_from_model(Blog);
    const first_blog = all_blogs[0];

    await api
      .put(`/blogs/api/${first_blog.id}`)
      .send({ likes: 99 })
      .expect(200);

    const altered_blog_list = await get_all_from_model(Blog);
    const altered_first_blog = altered_blog_list[0];
    expect(altered_first_blog.likes).toEqual(99);
  });
});

describe('total_likes()', () => {
  const one_article_blog_list = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ];

  test('equals the "likes" property data of its one blog post', () => {
    const result = total_likes(one_article_blog_list);
    expect(result).toBe(5);
  });

  test('equals the total number of likes in each blog post', () => {
    const result = total_likes(init_blog_list);
    expect(result).toBe(36);
  });
});

describe('favorite_blog()', () => {
  test('returns the top blog post according to likes', () => {
    const result = favorite_blog(init_blog_list);
    expect(result).toEqual({
      // Exclude _id and __v
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
