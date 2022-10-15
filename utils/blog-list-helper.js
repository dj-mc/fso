const total_likes = (blog_list_array) => {
  if (blog_list_array.length === 0) return 0;
  return blog_list_array.reduce((sum, current_post) => {
    return sum + current_post.likes;
  }, 0);
};

const favorite_blog = (blog_list_array) => {
  const likes_values = [];
  for (const blog of blog_list_array) {
    likes_values.push(blog.likes);
  }

  const idx = likes_values.indexOf(Math.max(...likes_values));
  const favorite_blog = blog_list_array[idx];
  delete favorite_blog._id;
  delete favorite_blog.__v;

  return {
    ...favorite_blog
  };
};

module.exports = { total_likes, favorite_blog };
