const { body } = require('express-validator');

const submitRatingValidator = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
];

module.exports = { submitRatingValidator };
