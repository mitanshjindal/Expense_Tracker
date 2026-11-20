const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://mitanshjindal001:Mitansh80@cluster0.s9c4zcv.mongodb.net/expensetrack?retryWrites=true&w=majority';

async function refreshDatabase() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log('Connected to MongoDB Atlas successfully.');

  const db = mongoose.connection.db;

  // 1. Clear existing collections
  console.log('Clearing existing collections (expenses, incomes, users)...');
  try {
    await db.collection('expenses').deleteMany({});
    console.log('Cleared expenses collection.');
  } catch (e) {
    console.log('Expenses collection does not exist or already empty.');
  }

  try {
    await db.collection('incomes').deleteMany({});
    console.log('Cleared incomes collection.');
  } catch (e) {
    console.log('Incomes collection does not exist or already empty.');
  }

  try {
    await db.collection('users').deleteMany({});
    console.log('Cleared users collection.');
  } catch (e) {
    console.log('Users collection does not exist or already empty.');
  }

  // 2. Hash passwords
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('password123', 10);

  // 3. Insert fresh users
  console.log('Inserting seed users...');
  const usersResult = await db.collection('users').insertMany([
    {
      username: 'Admin',
      email: 'mitanshjindal001@gmail.com',
      password: adminPasswordHash,
      isAdmin: true,
      hasPaid: true,
      paymentDate: new Date('2026-08-01T10:00:00Z'),
      createdAt: new Date('2026-08-01T10:00:00Z'),
      updatedAt: new Date()
    },
    {
      username: 'Mitansh',
      email: 'mitansh0824.be23@chitkara.edu.in',
      password: userPasswordHash,
      isAdmin: false,
      hasPaid: true,
      paymentDate: new Date('2026-09-01T10:00:00Z'),
      createdAt: new Date('2026-09-01T10:00:00Z'),
      updatedAt: new Date()
    },
    {
      username: 'AlexR',
      email: 'alex@example.com',
      password: userPasswordHash,
      isAdmin: false,
      hasPaid: true,
      paymentDate: new Date('2026-10-01T10:00:00Z'),
      createdAt: new Date('2026-10-01T10:00:00Z'),
      updatedAt: new Date()
    }
  ]);

  const adminId = usersResult.insertedIds[0];
  const mitanshId = usersResult.insertedIds[1];
  const alexId = usersResult.insertedIds[2];

  console.log(`Created 3 users:
  - Admin (mitanshjindal001@gmail.com) [ID: ${adminId}]
  - Mitansh (mitansh0824.be23@chitkara.edu.in) [ID: ${mitanshId}]
  - AlexR (alex@example.com) [ID: ${alexId}]`);

  // 4. Seed Incomes for Admin & other users
  console.log('Seeding dynamic incomes across multiple months...');
  await db.collection('incomes').insertMany([
    // Admin Incomes - November 2026
    {
      user: adminId,
      name: 'Primary Tech Salary',
      amount: 6500,
      category: 'Salary',
      date: new Date('2026-11-01T09:00:00Z'),
      referral: 'REF-NOV-01',
      createdAt: new Date('2026-11-01T09:00:00Z'),
      updatedAt: new Date('2026-11-01T09:00:00Z')
    },
    {
      user: adminId,
      name: 'Full-Stack Consulting',
      amount: 1850,
      category: 'Freelance',
      date: new Date('2026-11-08T14:30:00Z'),
      referral: 'CLIENT-WEBAPP',
      createdAt: new Date('2026-11-08T14:30:00Z'),
      updatedAt: new Date('2026-11-08T14:30:00Z')
    },
    {
      user: adminId,
      name: 'Index Fund Dividend',
      amount: 420,
      category: 'Investment',
      date: new Date('2026-11-15T11:00:00Z'),
      referral: 'VANGUARD-DIV',
      createdAt: new Date('2026-11-15T11:00:00Z'),
      updatedAt: new Date('2026-11-15T11:00:00Z')
    },
    // Admin Incomes - October 2026
    {
      user: adminId,
      name: 'Primary Tech Salary',
      amount: 6500,
      category: 'Salary',
      date: new Date('2026-10-01T09:00:00Z'),
      referral: 'REF-OCT-01',
      createdAt: new Date('2026-10-01T09:00:00Z'),
      updatedAt: new Date('2026-10-01T09:00:00Z')
    },
    {
      user: adminId,
      name: 'Mobile App Contract',
      amount: 2200,
      category: 'Freelance',
      date: new Date('2026-10-14T16:00:00Z'),
      referral: 'APP-STORE-GIG',
      createdAt: new Date('2026-10-14T16:00:00Z'),
      updatedAt: new Date('2026-10-14T16:00:00Z')
    },
    // Admin Incomes - September 2026
    {
      user: adminId,
      name: 'Primary Tech Salary',
      amount: 6500,
      category: 'Salary',
      date: new Date('2026-09-01T09:00:00Z'),
      referral: 'REF-SEP-01',
      createdAt: new Date('2026-09-01T09:00:00Z'),
      updatedAt: new Date('2026-09-01T09:00:00Z')
    },
    {
      user: adminId,
      name: 'Q3 Performance Bonus',
      amount: 1500,
      category: 'Salary',
      date: new Date('2026-09-25T17:00:00Z'),
      referral: 'BONUS-Q3',
      createdAt: new Date('2026-09-25T17:00:00Z'),
      updatedAt: new Date('2026-09-25T17:00:00Z')
    },
    // Admin Incomes - August 2026
    {
      user: adminId,
      name: 'Primary Tech Salary',
      amount: 6200,
      category: 'Salary',
      date: new Date('2026-08-01T09:00:00Z'),
      referral: 'REF-AUG-01',
      createdAt: new Date('2026-08-01T09:00:00Z'),
      updatedAt: new Date('2026-08-01T09:00:00Z')
    },

    // Mitansh Incomes
    {
      user: mitanshId,
      name: 'Engineering Stipend',
      amount: 3200,
      category: 'Salary',
      date: new Date('2026-11-05T10:00:00Z'),
      referral: 'UNI-STIPEND',
      createdAt: new Date('2026-11-05T10:00:00Z'),
      updatedAt: new Date('2026-11-05T10:00:00Z')
    },
    {
      user: mitanshId,
      name: 'Frontend Gig',
      amount: 950,
      category: 'Freelance',
      date: new Date('2026-11-12T15:00:00Z'),
      referral: 'GIG-02',
      createdAt: new Date('2026-11-12T15:00:00Z'),
      updatedAt: new Date('2026-11-12T15:00:00Z')
    },

    // Alex Incomes
    {
      user: alexId,
      name: 'Product Manager Salary',
      amount: 5200,
      category: 'Salary',
      date: new Date('2026-11-01T09:00:00Z'),
      referral: 'PM-SALARY',
      createdAt: new Date('2026-11-01T09:00:00Z'),
      updatedAt: new Date('2026-11-01T09:00:00Z')
    }
  ]);

  // 5. Seed Expenses for Admin & other users
  console.log('Seeding dynamic expenses across multiple categories...');
  await db.collection('expenses').insertMany([
    // Admin Expenses - November 2026
    {
      user: adminId,
      name: 'Luxury Apartment Rent',
      amount: 1500,
      category: 'Utilities',
      date: new Date('2026-11-02T10:00:00Z'),
      referral: 'RENT-NOV',
      createdAt: new Date('2026-11-02T10:00:00Z'),
      updatedAt: new Date('2026-11-02T10:00:00Z')
    },
    {
      user: adminId,
      name: 'Whole Foods Market Groceries',
      amount: 345.50,
      category: 'Food',
      date: new Date('2026-11-04T12:30:00Z'),
      referral: 'WF-RECEIPT-441',
      createdAt: new Date('2026-11-04T12:30:00Z'),
      updatedAt: new Date('2026-11-04T12:30:00Z')
    },
    {
      user: adminId,
      name: 'Electricity & Gas Bill',
      amount: 175.20,
      category: 'Utilities',
      date: new Date('2026-11-07T14:00:00Z'),
      referral: 'POWER-CO',
      createdAt: new Date('2026-11-07T14:00:00Z'),
      updatedAt: new Date('2026-11-07T14:00:00Z')
    },
    {
      user: adminId,
      name: 'Fine Dining Bistro',
      amount: 160.00,
      category: 'Food',
      date: new Date('2026-11-10T20:00:00Z'),
      referral: 'DINNER-09',
      createdAt: new Date('2026-11-10T20:00:00Z'),
      updatedAt: new Date('2026-11-10T20:00:00Z')
    },
    {
      user: adminId,
      name: 'Fiber Internet & Mobile',
      amount: 120.00,
      category: 'Utilities',
      date: new Date('2026-11-14T11:15:00Z'),
      referral: 'TELCO-AUTO',
      createdAt: new Date('2026-11-14T11:15:00Z'),
      updatedAt: new Date('2026-11-14T11:15:00Z')
    },
    {
      user: adminId,
      name: 'Fuel & EV Fast Charging',
      amount: 95.00,
      category: 'Transportation',
      date: new Date('2026-11-17T08:30:00Z'),
      referral: 'CHARGE-POINT',
      createdAt: new Date('2026-11-17T08:30:00Z'),
      updatedAt: new Date('2026-11-17T08:30:00Z')
    },
    // Admin Expenses - October 2026
    {
      user: adminId,
      name: 'Luxury Apartment Rent',
      amount: 1500,
      category: 'Utilities',
      date: new Date('2026-10-02T10:00:00Z'),
      referral: 'RENT-OCT',
      createdAt: new Date('2026-10-02T10:00:00Z'),
      updatedAt: new Date('2026-10-02T10:00:00Z')
    },
    {
      user: adminId,
      name: 'Organic Supermarket',
      amount: 420.00,
      category: 'Food',
      date: new Date('2026-10-08T18:00:00Z'),
      referral: 'REC-OCT-08',
      createdAt: new Date('2026-10-08T18:00:00Z'),
      updatedAt: new Date('2026-10-08T18:00:00Z')
    },
    {
      user: adminId,
      name: 'Cinema & Concert Tickets',
      amount: 185.00,
      category: 'Entertainment',
      date: new Date('2026-10-18T21:00:00Z'),
      referral: 'TICKETS-01',
      createdAt: new Date('2026-10-18T21:00:00Z'),
      updatedAt: new Date('2026-10-18T21:00:00Z')
    },
    {
      user: adminId,
      name: 'Domestic Airline Flight',
      amount: 350.00,
      category: 'Transportation',
      date: new Date('2026-10-24T06:00:00Z'),
      referral: 'AIR-TRAVEL',
      createdAt: new Date('2026-10-24T06:00:00Z'),
      updatedAt: new Date('2026-10-24T06:00:00Z')
    },
    // Admin Expenses - September 2026
    {
      user: adminId,
      name: 'Luxury Apartment Rent',
      amount: 1500,
      category: 'Utilities',
      date: new Date('2026-09-02T10:00:00Z'),
      referral: 'RENT-SEP',
      createdAt: new Date('2026-09-02T10:00:00Z'),
      updatedAt: new Date('2026-09-02T10:00:00Z')
    },
    {
      user: adminId,
      name: 'Ergonomic Desk & Chair',
      amount: 520.00,
      category: 'Other',
      date: new Date('2026-09-12T15:00:00Z'),
      referral: 'OFFICE-SETUP',
      createdAt: new Date('2026-09-12T15:00:00Z'),
      updatedAt: new Date('2026-09-12T15:00:00Z')
    },
    {
      user: adminId,
      name: 'Groceries & Household Goods',
      amount: 380.00,
      category: 'Food',
      date: new Date('2026-09-20T17:00:00Z'),
      referral: 'STORE-99',
      createdAt: new Date('2026-09-20T17:00:00Z'),
      updatedAt: new Date('2026-09-20T17:00:00Z')
    },
    // Admin Expenses - August 2026
    {
      user: adminId,
      name: 'Luxury Apartment Rent',
      amount: 1500,
      category: 'Utilities',
      date: new Date('2026-08-02T10:00:00Z'),
      referral: 'RENT-AUG',
      createdAt: new Date('2026-08-02T10:00:00Z'),
      updatedAt: new Date('2026-08-02T10:00:00Z')
    },
    {
      user: adminId,
      name: 'Noise-Canceling Headphones',
      amount: 380.00,
      category: 'Other',
      date: new Date('2026-08-14T13:00:00Z'),
      referral: 'SONY-XM5',
      createdAt: new Date('2026-08-14T13:00:00Z'),
      updatedAt: new Date('2026-08-14T13:00:00Z')
    },

    // Mitansh Expenses
    {
      user: mitanshId,
      name: 'Campus Dining & Meal Plan',
      amount: 720.00,
      category: 'Food',
      date: new Date('2026-11-06T13:00:00Z'),
      referral: 'MEAL-PLAN',
      createdAt: new Date('2026-11-06T13:00:00Z'),
      updatedAt: new Date('2026-11-06T13:00:00Z')
    },
    {
      user: mitanshId,
      name: 'Metro Commute Card',
      amount: 120.00,
      category: 'Transportation',
      date: new Date('2026-11-09T08:00:00Z'),
      referral: 'METRO-PASS',
      createdAt: new Date('2026-11-09T08:00:00Z'),
      updatedAt: new Date('2026-11-09T08:00:00Z')
    },

    // Alex Expenses
    {
      user: alexId,
      name: 'City Studio Rent',
      amount: 1250.00,
      category: 'Utilities',
      date: new Date('2026-11-03T11:00:00Z'),
      referral: 'ALEX-RENT',
      createdAt: new Date('2026-11-03T11:00:00Z'),
      updatedAt: new Date('2026-11-03T11:00:00Z')
    },
    {
      user: alexId,
      name: 'Organic Market',
      amount: 310.00,
      category: 'Food',
      date: new Date('2026-11-08T19:00:00Z'),
      referral: 'FOOD-ALEX',
      createdAt: new Date('2026-11-08T19:00:00Z'),
      updatedAt: new Date('2026-11-08T19:00:00Z')
    }
  ]);

  console.log('All seed transactions inserted successfully!');

  // 6. Verification
  const userCount = await db.collection('users').countDocuments();
  const incomeCount = await db.collection('incomes').countDocuments();
  const expenseCount = await db.collection('expenses').countDocuments();

  console.log(`\n================ DATABASE REFRESH COMPLETE ================`);
  console.log(`Total Users: ${userCount}`);
  console.log(`Total Incomes: ${incomeCount}`);
  console.log(`Total Expenses: ${expenseCount}`);
  console.log(`Admin credentials:
    Email: mitanshjindal001@gmail.com
    Password: admin123
    Role: Admin (isAdmin: true, hasPaid: true)`);
  console.log(`===========================================================\n`);

  await mongoose.disconnect();
  console.log('MongoDB connection closed.');
  process.exit(0);
}

refreshDatabase().catch((err) => {
  console.error('Database refresh failed:', err);
  process.exit(1);
});

