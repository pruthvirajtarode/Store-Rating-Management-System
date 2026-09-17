const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { seedDatabase } = require('../controllers/seedController');
const { addUserValidation, addStoreValidation } = require('../validators/adminValidator');
const validate = require('../middleware/validate');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Temporary public route for initial database seeding
router.get('/seed', seedDatabase);

router.use(authenticateToken);
router.use(requireRole('ADMIN'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.post('/users', addUserValidation, validate, adminController.addUser);
router.get('/users/:id', adminController.getUserById);
router.get('/stores', adminController.getStores);
router.post('/stores', addStoreValidation, validate, adminController.addStore);

module.exports = router;
