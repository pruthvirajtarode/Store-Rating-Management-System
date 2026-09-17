const bcrypt = require('bcryptjs');
const prisma = require('../config/db');

const seedDatabase = async (req, res, next) => {
  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('Secure@123', saltRounds);
    
    // Upsert Admin
    const admin = await prisma.user.upsert({
      where: { email: 'admin@ratehub.com' },
      update: {},
      create: {
        name: 'Alex Sterling (Admin)',
        email: 'admin@ratehub.com',
        passwordHash,
        address: '100 Silicon Valley Blvd, CA',
        role: 'ADMIN',
      }
    });

    // Upsert Store Owners
    const owner1 = await prisma.user.upsert({
      where: { email: 'owner1@ratehub.com' },
      update: {},
      create: {
        name: 'Sarah Jenkins',
        email: 'owner1@ratehub.com',
        passwordHash,
        address: '42 Innovation Drive, NY',
        role: 'STORE_OWNER',
      }
    });

    const owner2 = await prisma.user.upsert({
      where: { email: 'owner2@ratehub.com' },
      update: {},
      create: {
        name: 'Marcus Thorne',
        email: 'owner2@ratehub.com',
        passwordHash,
        address: '88 Creative Lane, TX',
        role: 'STORE_OWNER',
      }
    });

    // Upsert Normal Users for Ratings
    const users = [];
    for (let i = 1; i <= 3; i++) {
      const u = await prisma.user.upsert({
        where: { email: `user${i}@ratehub.com` },
        update: {},
        create: {
          name: `Reviewer ${i}`,
          email: `user${i}@ratehub.com`,
          passwordHash,
          address: `User City ${i}`,
          role: 'USER',
        }
      });
      users.push(u);
    }

    // Clean existing stores to replace with premium ones
    await prisma.rating.deleteMany();
    await prisma.store.deleteMany();

    // Create Premium Stores
    const premiumStores = [
      {
        name: 'Lumina Tech Emporium',
        email: 'contact@luminatech.com',
        address: 'Downtown Metro, Sector 4',
        ownerId: owner1.id,
        imageUrl: '/images/tech_store.jpg'
      },
      {
        name: 'Artisan Coffee Reserve',
        email: 'hello@artisancoffee.com',
        address: 'Historic District, Avenue B',
        ownerId: owner2.id,
        imageUrl: '/images/coffee_shop.jpg'
      },
      {
        name: 'Vertex Fitness & Gear',
        email: 'support@vertexfit.com',
        address: 'Westside Promenade',
        ownerId: owner1.id,
        imageUrl: '/images/fitness_store.jpg'
      },
      {
        name: 'Elegance Fashion Boutique',
        email: 'info@eleganceboutique.com',
        address: 'High Street Mall',
        ownerId: owner2.id,
        imageUrl: '/images/boutique.jpg'
      },
      {
        name: 'GreenLeaf Organic Grocer',
        email: 'fresh@greenleaf.com',
        address: 'Suburban Plaza',
        ownerId: owner1.id,
        imageUrl: '/images/organic_store.jpg'
      }
    ];

    const createdStores = [];
    for (const s of premiumStores) {
      const store = await prisma.store.create({ data: s });
      createdStores.push(store);
    }

    // Add realistic mixed ratings
    const ratingsData = [
      { userId: users[0].id, storeId: createdStores[0].id, rating: 5 },
      { userId: users[1].id, storeId: createdStores[0].id, rating: 4 },
      { userId: users[2].id, storeId: createdStores[0].id, rating: 5 },
      
      { userId: users[0].id, storeId: createdStores[1].id, rating: 5 },
      { userId: users[2].id, storeId: createdStores[1].id, rating: 3 },
      
      { userId: users[1].id, storeId: createdStores[2].id, rating: 4 },
      
      { userId: users[0].id, storeId: createdStores[3].id, rating: 5 },
      { userId: users[1].id, storeId: createdStores[3].id, rating: 5 },
      
      { userId: users[2].id, storeId: createdStores[4].id, rating: 4 },
    ];

    await prisma.rating.createMany({ data: ratingsData });

    res.status(200).json({ success: true, message: 'Database successfully seeded with premium advanced data!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { seedDatabase };
