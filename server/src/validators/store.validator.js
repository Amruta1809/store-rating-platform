const { body } = require('express-validator');
const { addressField, emailField } = require('./fields');

const createStoreValidator = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage('Store name must be at most 60 characters'),
  emailField(),
  addressField(),
  body('ownerId').optional().isInt().withMessage('ownerId must be a valid user id'),
];

module.exports = { createStoreValidator };
