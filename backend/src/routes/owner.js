const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.use(authenticateToken);
router.use(requireRole('STORE_OWNER'));

router.get('/dashboard', ownerController.getOwnerDashboard);
router.get('/ratings', ownerController.getOwnerRatings);

module.exports = router;
