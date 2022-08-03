const express = require('express');
const morgan = require('morgan');

const app = express();

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/', (req, res) => {
  res.send(`<h1>Home</h1>`);
});

const PORT = process.env.PORT || 9001;

app
  .use('/notes', require('./notes-server').app)
  .use('/phonebook', require('./phonebook-server').app)
  .listen(PORT);

console.log('Listener is serving to http://127.0.0.1:9001/');
