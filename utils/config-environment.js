const PORT = process.env.PORT || 9001;
const mongodb_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

module.exports = { PORT, mongodb_URI };
