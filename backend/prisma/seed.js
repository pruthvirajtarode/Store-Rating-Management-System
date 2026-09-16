const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('Secure@123', saltRounds); // Minimum 8 chars, 1 uppercase, 1 special

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator User',
      email: 'admin@ratehub.com',
      passwordHash,
      address: '123 Admin Street, Tech City',
      role: 'ADMIN',
    },
  });

  // Create Store Owners
  const owner1 = await prisma.user.create({
    data: {
      name: 'Owner One Registered User',
      email: 'owner1@ratehub.com',
      passwordHash,
      address: '456 Owner Avenue, Tech City',
      role: 'STORE_OWNER',
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      name: 'Owner Two Registered User',
      email: 'owner2@ratehub.com',
      passwordHash,
      address: '789 Owner Boulevard, Tech City',
      role: 'STORE_OWNER',
    },
  });

  // Create Normal Users
  const users = [];
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        name: `Normal User Number ${i} Account`,
        email: `user${i}@ratehub.com`,
        passwordHash,
        address: `${i}00 User Road, Tech City`,
        role: 'USER',
      },
    });
    users.push(user);
  }

  // Create Stores
  const stores = [];
  for (let i = 1; i <= 5; i++) {
    const store = await prisma.store.create({
      data: {
        name: `Super Mega Store Number ${i}`,
        email: `contact@store${i}.com`,
        address: `${i}11 Store Plaza, Tech City`,
        ownerId: i % 2 === 0 ? owner2.id : owner1.id,
      },
    });
    stores.push(store);
  }

  // Create Ratings
  // User 1 rates Store 1 (5 stars)
  await prisma.rating.create({ data: { userId: users[0].id, storeId: stores[0].id, rating: 5 } });
  // User 2 rates Store 1 (4 stars)
  await prisma.rating.create({ data: { userId: users[1].id, storeId: stores[0].id, rating: 4 } });
  
  // User 3 rates Store 2 (3 stars)
  await prisma.rating.create({ data: { userId: users[2].id, storeId: stores[1].id, rating: 3 } });

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
