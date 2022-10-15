const mongoose = require('mongoose');
const {
  afterAll,
  beforeEach,
  describe,
  expect,
  test
} = require('@jest/globals');
const supertest = require('supertest');
const { Blog } = require('../models/Blog');
const { total_likes, favorite_blog } = require('../utils/blog-list-helper');
const init_blog_list = require('../test-data/blog-list.json').blogs;

const app = require('../app');
const api = supertest(app);

describe('/blogs/api', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    for (let blog of init_blog_list) {
      let new_blog = new Blog(blog);
      await new_blog.save();
    }
  });

  test('returns the correct amount of blog posts in JSON format', async () => {
    const response = await api.get('/blogs/api');
    expect(response.body).toHaveLength(init_blog_list.length);
  });

  test('returns blog posts, each containing a unique id property', async () => {
    const response = await api.get('/blogs/api');
    for (let blog of response.body) {
      expect(blog.id).toBeDefined();
    }
  });

  test('posts a valid blog listing to database', async () => {
    const new_blog = {
      title: 'title of blog post',
      author: 'author of blog post',
      url: 'https://url.123/blog',
      likes: 3
    };

    await api
      .post('/blogs/api')
      .send(new_blog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const all_blogs = await Blog.find({});
    const all_blogs_toJSON = all_blogs.map((blog) => blog.toJSON());
    expect(all_blogs_toJSON).toHaveLength(init_blog_list.length + 1);
  });

  test('posts a blog listing with no likes property to database', async () => {
    const new_blog = {
      title: 'Programming Programs',
      author: 'Programmer',
      url: 'https://foo.369/vlog'
    };

    await api
      .post('/blogs/api')
      .send(new_blog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const all_blogs = await Blog.find({});
    const all_blogs_toJSON = all_blogs.map((blog) => blog.toJSON());
    expect(all_blogs_toJSON).toHaveLength(init_blog_list.length + 1);
  });

  test('returns status code 400 if new_blog has no title or url', async () => {
    const new_blog = { author: 'John Doe', likes: 999 };
    await api.post('/blogs/api').send(new_blog).expect(400);
  });

  test('returns status code 204 after deleting a blog post', async () => {
    const all_blogs = await Blog.find({});
    const all_blogs_toJSON = all_blogs.map((blog) => blog.toJSON());
    const first_blog = all_blogs_toJSON[0];

    await api.delete(`/blogs/api/${first_blog.id}`).expect(204);

    const altered_blog_list = await Blog.find({});
    const altered_blog_list_toJSON = altered_blog_list.map((blog) =>
      blog.toJSON()
    );
    expect(altered_blog_list_toJSON).toHaveLength(init_blog_list.length - 1);
  });

  test('return status code 200 after updating a blog post', async () => {
    const all_blogs = await Blog.find({});
    const all_blogs_toJSON = all_blogs.map((blog) => blog.toJSON());
    const first_blog = all_blogs_toJSON[0];

    await api
      .put(`/blogs/api/${first_blog.id}`)
      .send({ likes: 99 })
      .expect(200);

    const altered_blog_list = await Blog.find({});
    const altered_blog_list_toJSON = altered_blog_list.map((blog) =>
      blog.toJSON()
    );
    const altered_first_blog = altered_blog_list_toJSON[0];
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

  test('equals the "likes" property data of its one blog listing', () => {
    const result = total_likes(one_article_blog_list);
    expect(result).toBe(5);
  });

  test('equals the total number of likes in each blog listing', () => {
    const result = total_likes(init_blog_list);
    expect(result).toBe(36);
  });
});

describe('favorite_blog()', () => {
  test('returns the top blog listing according to likes', () => {
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
