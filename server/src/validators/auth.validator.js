const { body } = require('express-validator');
const { nameField, addressField, emailField, passwordField } = require('./fields');

const signupValidator = [nameField(), emailField(), addressField(), passwordField()];

const loginValidator = [
  emailField(),
  body('password').notEmpty().withMessage('Password is required'),
];

const updatePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  passwordField('newPassword'),
];

module.exports = { signupValidator, loginValidator, updatePasswordValidator };
