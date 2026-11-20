const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://mitanshjindal001:Mitansh80@cluster0.s9c4zcv.mongodb.net/expensetrack?retryWrites=true&w=majority';

async function checkAndCleanOrphans() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  const users = await db.collection('users').find({}).toArray();
  const existingUserIds = users.map(u => u._id);
  const existingUserIdStrings = existingUserIds.map(id => id.toString());
  console.log('Existing users count:', users.length);
  console.log('Existing users:', users.map(u => ({ id: u._id.toString(), username: u.username })));

  const expenses = await db.collection('expenses').find({}).toArray();
  const orphanedExpenses = expenses.filter(e => !e.user || !existingUserIdStrings.includes(e.user.toString()));
  console.log('Total expenses:', expenses.length, 'Orphaned expenses:', orphanedExpenses.length);

  const incomes = await db.collection('incomes').find({}).toArray();
  const orphanedIncomes = incomes.filter(i => !i.user || !existingUserIdStrings.includes(i.user.toString()));
  console.log('Total incomes:', incomes.length, 'Orphaned incomes:', orphanedIncomes.length);

  if (orphanedExpenses.length > 0 || orphanedIncomes.length > 0) {
    console.log('Purging orphaned expenses and incomes...');
    const delExp = await db.collection('expenses').deleteMany({
      user: { $nin: existingUserIds }
    });
    const delInc = await db.collection('incomes').deleteMany({
      user: { $nin: existingUserIds }
    });
    console.log(`Successfully purged:
      - ${delExp.deletedCount} orphaned expenses
      - ${delInc.deletedCount} orphaned incomes`);
  } else {
    console.log('No orphaned records found in MongoDB right now.');
  }

  await mongoose.disconnect();
  process.exit(0);
}

checkAndCleanOrphans().catch(err => {
  console.error(err);
  process.exit(1);
});

