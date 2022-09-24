const path = require('path');
const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const { PORT, mongodb_URI } = require('./utils/config');
const {
  request_logger,
  unknown_route,
  error_handler
} = require('./utils/middleware');
const cors = require('cors');

mongoose
  .connect(mongodb_URI)
  .then((_) => {
    console.log(`Connected to ${mongodb_URI}`);
  })
  .catch((error) => {
    console.log(error.message);
  });

const app = express();

app.use(cors());

app.use(
  '/static',
  express.static(path.join(__dirname, '/static'), {
    index: false,
    extensions: ['css', 'png']
  })
);

app.use(favicon(path.join(__dirname, 'static', 'dragon.png')));

app.use(
  '/dist',
  express.static(path.join(__dirname, '/dist'), {
    index: false,
    extensions: ['js', 'js.map']
  })
);

app.use(express.json());
app.use(request_logger);

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app
  .use('/notes', require('./routers/notes-router').app)
  .use('/phonebook', require('./routers/phonebook-router').app)
  .listen(PORT);

app.use(unknown_route);
app.use(error_handler);

console.log(`Listener is serving to http://127.0.0.1:${PORT}/`);
