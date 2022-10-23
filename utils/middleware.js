const request_logger = (request, _, next) => {
  console.log(`
    \n Method: ${request.method}
    \n Path: ${request.path}
    \n Body: ${request.body}
    \n ---`);
  next();
};

const unknown_route = (_, response) => {
  response.status(404).send({ error: 'Requested route not found' });
};

const get_token_from = (request, _, next) => {
  const auth = request.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer')) {
    request.token = auth.substring(7);
  }
  next();
};

const error_handler = (error, _, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformed id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'Invalid token'
    });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'Login token expired'
    });
  }

  console.error(error.message);
  next(error);
};

module.exports = {
  request_logger,
  unknown_route,
  get_token_from,
  error_handler
};
