const prisma = require('../config/db');

const getStores = async (req, res, next) => {
  try {
    let { search, sortBy, sortOrder, page, limit } = req.query;
    const userId = req.user.userId;
    
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    
    const validSortFields = ['name', 'address'];
    sortBy = validSortFields.includes(sortBy) ? sortBy : 'name';
    sortOrder = sortOrder === 'desc' ? 'desc' : 'asc';

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [rawStores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        include: {
          ratings: { select: { id: true, rating: true, userId: true } }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.store.count({ where })
    ]);

    let stores = rawStores.map(store => {
      const avg = store.ratings.length > 0 
        ? parseFloat((store.ratings.reduce((a, b) => a + b.rating, 0) / store.ratings.length).toFixed(1))
        : 0;
      
      const userRating = store.ratings.find(r => r.userId === userId);

      return { 
        id: store.id,
        name: store.name,
        address: store.address,
        imageUrl: store.imageUrl,
        averageRating: avg, 
        userRating: userRating ? userRating.rating : null,
        userRatingId: userRating ? userRating.id : null
      };
    });

    res.status(200).json({
      success: true,
      data: {
        stores,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getStoreById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const store = await prisma.store.findUnique({
      where: { id: parseInt(id) },
      include: {
        ratings: { select: { rating: true } }
      }
    });

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found.' });
    }

    const avg = store.ratings.length > 0 
      ? parseFloat((store.ratings.reduce((a, b) => a + b.rating, 0) / store.ratings.length).toFixed(1))
      : 0;

    res.status(200).json({ 
      success: true, 
      data: {
        id: store.id,
        name: store.name,
        address: store.address,
        imageUrl: store.imageUrl,
        averageRating: avg
      } 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStores,
  getStoreById
};
