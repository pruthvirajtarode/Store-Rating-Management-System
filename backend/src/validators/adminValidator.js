const { body } = require('express-validator');

const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

const addUserValidation = [
  body('name')
    .isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters.'),
  body('email')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('address')
    .isLength({ max: 400 }).withMessage('Address must not exceed 400 characters.')
    .notEmpty().withMessage('Address is required.'),
  body('password')
    .matches(passwordRegex).withMessage('Password must be between 8 and 16 characters, and contain at least one uppercase letter and one special character.'),
  body('role')
    .isIn(['ADMIN', 'USER', 'STORE_OWNER']).withMessage('Invalid role.'),
];

const addStoreValidation = [
  body('name')
    .isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters.'),
  body('email')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('address')
    .isLength({ max: 400 }).withMessage('Address must not exceed 400 characters.')
    .notEmpty().withMessage('Address is required.'),
  body('ownerId')
    .isInt().withMessage('Owner ID is required.'),
];

module.exports = {
  addUserValidation,
  addStoreValidation
};
