const prisma = require('../config/db');

const getOwnerDashboard = async (req, res, next) => {
  try {
    const ownerId = req.user.userId;

    const stores = await prisma.store.findMany({
      where: { ownerId },
      include: {
        ratings: {
          include: {
            user: { select: { name: true, email: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    const dashboardData = stores.map(store => {
      const avg = store.ratings.length > 0
        ? parseFloat((store.ratings.reduce((a, b) => a + b.rating, 0) / store.ratings.length).toFixed(1))
        : 0;
      
      return {
        id: store.id,
        name: store.name,
        address: store.address,
        imageUrl: store.imageUrl,
        averageRating: avg,
        totalRatings: store.ratings.length,
        ratings: store.ratings.map(r => ({
          id: r.id,
          userName: r.user.name,
          userEmail: r.user.email,
          rating: r.rating,
          submittedAt: r.createdAt
        }))
      };
    });

    res.status(200).json({ success: true, data: dashboardData });
  } catch (error) {
    next(error);
  }
};

const getOwnerRatings = async (req, res, next) => {
  // Essentially the same as dashboard for this scope, or can be paginated.
  getOwnerDashboard(req, res, next);
};

module.exports = {
  getOwnerDashboard,
  getOwnerRatings
};
