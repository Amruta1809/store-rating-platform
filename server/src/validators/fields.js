const { body } = require('express-validator');

// Password: 8-16 chars, at least one uppercase letter and one special character
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;

const nameField = (field = 'name') =>
  body(field)
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters');

const addressField = (field = 'address') =>
  body(field)
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must be at most 400 characters');

const emailField = (field = 'email') =>
  body(field).trim().isEmail().withMessage('Must be a valid email address').normalizeEmail();

const passwordField = (field = 'password') =>
  body(field)
    .matches(PASSWORD_REGEX)
    .withMessage(
      'Password must be 8-16 characters and include at least one uppercase letter and one special character'
    );

module.exports = { nameField, addressField, emailField, passwordField, PASSWORD_REGEX };
