require('dotenv').config();

const http = require('http');
const config = require('./utils/config-environment');
const app = require('./app');

const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log(`Listener is serving to http://127.0.0.1:${config.PORT}/`);
});
