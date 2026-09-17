const { body } = require('express-validator');

// Name: 20-60 chars
// Address: Max 400 chars
// Password: 8-16 chars, at least one uppercase, at least one special char
const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

const signupValidation = [
  body('name')
    .isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters.')
    .matches(/^[A-Za-z\s]+$/).withMessage('Name must contain only letters and spaces.'),
  body('email')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('address')
    .isLength({ max: 400 }).withMessage('Address must not exceed 400 characters.')
    .notEmpty().withMessage('Address is required.'),
  body('password')
    .matches(passwordRegex).withMessage('Password must be between 8 and 16 characters, and contain at least one uppercase letter and one special character.'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email address.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword')
    .matches(passwordRegex).withMessage('New password must be between 8 and 16 characters, and contain at least one uppercase letter and one special character.'),
  body('confirmNewPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('New passwords do not match.');
      }
      return true;
    }),
];

module.exports = {
  signupValidation,
  loginValidation,
  changePasswordValidation
};
