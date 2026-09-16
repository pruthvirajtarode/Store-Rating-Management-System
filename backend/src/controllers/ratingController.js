const prisma = require('../config/db');

const submitRating = async (req, res, next) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.userId;

    if (!storeId || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res.status(400).json({ success: false, message: 'Invalid rating data.' });
    }

    const store = await prisma.store.findUnique({ where: { id: parseInt(storeId) } });
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found.' });
    }

    const existingRating = await prisma.rating.findUnique({
      where: { userId_storeId: { userId, storeId: parseInt(storeId) } }
    });

    if (existingRating) {
      return res.status(409).json({ success: false, message: 'You have already rated this store.' });
    }

    const newRating = await prisma.rating.create({
      data: {
        userId,
        storeId: parseInt(storeId),
        rating: parseInt(rating)
      }
    });

    res.status(201).json({ success: true, message: 'Rating submitted successfully', data: newRating });
  } catch (error) {
    next(error);
  }
};

const updateRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.userId;

    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res.status(400).json({ success: false, message: 'Invalid rating value.' });
    }

    const existingRating = await prisma.rating.findUnique({ where: { id: parseInt(id) } });

    if (!existingRating) {
      return res.status(404).json({ success: false, message: 'Rating not found.' });
    }

    if (existingRating.userId !== userId) {
      return res.status(403).json({ success: false, message: 'You can only modify your own ratings.' });
    }

    const updatedRating = await prisma.rating.update({
      where: { id: parseInt(id) },
      data: { rating: parseInt(rating) }
    });

    res.status(200).json({ success: true, message: 'Rating updated successfully', data: updatedRating });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitRating,
  updateRating
};
