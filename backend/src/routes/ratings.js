const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.use(authenticateToken);
router.use(requireRole('USER'));

router.post('/', ratingController.submitRating);
router.put('/:id', ratingController.updateRating);

module.exports = router;
