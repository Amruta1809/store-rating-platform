const { body } = require('express-validator');
const { nameField, addressField, emailField, passwordField } = require('./fields');

const createUserValidator = [
  nameField(),
  emailField(),
  addressField(),
  passwordField(),
  body('role')
    .optional()
    .isIn(['ADMIN', 'NORMAL', 'STORE_OWNER'])
    .withMessage('Role must be one of ADMIN, NORMAL, STORE_OWNER'),
];

module.exports = { createUserValidator };
