const reverse_string = (str) => {
  return str.split('').reverse().join('');
};

const reduce_average = (given_array) => {
  const reducer_callback = (previous, current) => previous + current;
  if (given_array.length === 0) return 0;
  return given_array.reduce(reducer_callback, 0) / given_array.length;
};

module.exports = {
  reverse_string,
  reduce_average
};
