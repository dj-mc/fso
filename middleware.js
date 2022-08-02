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

module.exports = {
  request_logger,
  unknown_route
};
