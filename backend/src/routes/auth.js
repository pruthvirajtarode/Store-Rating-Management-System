const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { signupValidation, loginValidation, changePasswordValidation } = require('../validators/authValidator');
const validate = require('../middleware/validate');
const { authenticateToken } = require('../middleware/auth');

router.post('/signup', signupValidation, validate, authController.signup);
router.post('/login', loginValidation, validate, authController.login);
router.post('/change-password', authenticateToken, changePasswordValidation, validate, authController.changePassword);
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
