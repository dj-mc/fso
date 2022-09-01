const request_logger = (request, response, next) => {
  console.log(`
    \n Method: ${request.method}
    \n Path: ${request.path}
    \n Body: ${request.body}
    \n ---`);
  next();
};

const unknown_route = (request, response) => {
  response.status(404).send({ error: 'Requested route not found' });
};

const error_handler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' });
  }
  next(error);
};

module.exports = {
  request_logger,
  unknown_route,
  error_handler
};
