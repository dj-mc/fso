const path = require('path');
const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');

const app = express();
app.use(favicon(path.join(__dirname, 'static', 'dragon.png')));

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(
  '/static',
  express.static(path.join(__dirname, '/static'), {
    index: false,
    extensions: ['css', 'png']
  })
);

app.use(
  '/dist',
  express.static(path.join(__dirname, '/dist'), {
    index: false,
    extensions: ['js', 'js.map']
  })
);

const PORT = process.env.PORT || 9001;

app
  .use('/notes', require('./notes-server').app)
  .use('/phonebook', require('./phonebook-server').app)
  .listen(PORT);

console.log('Listener is serving to http://127.0.0.1:9001/');
