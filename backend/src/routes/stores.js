const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.use(authenticateToken);
// Assuming only USER needs to fetch stores like this, though ADMIN has their own
router.use(requireRole('USER')); 

router.get('/', storeController.getStores);
router.get('/:id', storeController.getStoreById);

module.exports = router;
