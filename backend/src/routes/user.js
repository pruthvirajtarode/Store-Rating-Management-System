const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const prisma = require('../config/db');

router.use(authenticateToken);
router.use(requireRole('USER'));

router.get('/ratings', async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const ratings = await prisma.rating.findMany({
      where: { userId },
      include: {
        store: { select: { id: true, name: true, address: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: ratings });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
