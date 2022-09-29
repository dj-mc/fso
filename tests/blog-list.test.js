const { describe, expect, test } = require('@jest/globals');
const { total_likes, favorite_blog } = require('../utils/blog-list-helper');
const full_blog_list = require('../test-data/blog.json');

describe('Total sum of likes in a blog list', () => {
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

  test('equals the "likes" property data of its one article', () => {
    const result = total_likes(one_article_blog_list);
    expect(result).toBe(5);
  });

  test('equals the total number of likes in each listing', () => {
    const result = total_likes(full_blog_list.blogs);
    expect(result).toBe(36);
  });
});

test('Return the top blog listing according to likes', () => {
  const result = favorite_blog(full_blog_list.blogs);
  expect(result).toEqual({
    // Exclude _id and __v
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  });
});
