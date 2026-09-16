const prisma = require('../config/db');
const bcrypt = require('bcryptjs');

const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true }
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStores,
        totalRatings,
        usersByRole
      }
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    let { search, role, sortBy, sortOrder, page, limit } = req.query;
    
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    
    const validSortFields = ['name', 'email', 'address', 'role', 'createdAt'];
    sortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    const where = {};
    if (role) {
      where.role = role;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.user.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { 
        id: true, name: true, email: true, address: true, role: true, createdAt: true,
        stores: {
          select: {
            id: true, name: true, 
            ratings: { select: { rating: true } }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.role === 'STORE_OWNER') {
      user.stores = user.stores.map(store => {
        const avg = store.ratings.length > 0 
          ? (store.ratings.reduce((a, b) => a + b.rating, 0) / store.ratings.length).toFixed(1) 
          : 0;
        return { ...store, averageRating: avg, ratings: undefined };
      });
    } else {
      delete user.stores;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const addUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already in use.' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: { name, email, passwordHash, address, role },
      select: { id: true, name: true, email: true, role: true }
    });

    res.status(201).json({ success: true, message: 'User created successfully', data: user });
  } catch (error) {
    next(error);
  }
};

const getStores = async (req, res, next) => {
  try {
    let { search, sortBy, sortOrder, page, limit } = req.query;
    
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    
    const validSortFields = ['name', 'email', 'address'];
    sortBy = validSortFields.includes(sortBy) ? sortBy : 'name';
    sortOrder = sortOrder === 'desc' ? 'desc' : 'asc';

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [rawStores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        include: {
          owner: { select: { id: true, name: true } },
          ratings: { select: { rating: true } }
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
      return { ...store, averageRating: avg, totalRatings: store.ratings.length, ratings: undefined };
    });

    if (req.query.sortBy === 'rating') {
      stores.sort((a, b) => sortOrder === 'desc' ? b.averageRating - a.averageRating : a.averageRating - b.averageRating);
    }

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

const addStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;
    
    const owner = await prisma.user.findUnique({ where: { id: parseInt(ownerId) } });
    if (!owner || owner.role !== 'STORE_OWNER') {
      return res.status(400).json({ success: false, message: 'Invalid owner ID or user is not a store owner.' });
    }

    const store = await prisma.store.create({
      data: { name, email, address, ownerId: parseInt(ownerId) }
    });

    res.status(201).json({ success: true, message: 'Store created successfully', data: store });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  addUser,
  getStores,
  addStore
};
