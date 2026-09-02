const { UniqueConstraintError, ValidationError } = require('sequelize');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({ message: 'A record with these details already exists' });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  return res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
