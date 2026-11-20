const User = require('../models/User');
const Expense = require('../models/Expense');
const Income = require('../models/Income');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userStats = await User.aggregate([
      {
        $lookup: {
          from: 'expenses',
          localField: '_id',
          foreignField: 'user',
          as: 'expenses'
        }
      },
      {
        $lookup: {
          from: 'incomes',
          localField: '_id',
          foreignField: 'user',
          as: 'incomes'
        }
      },
      {
        $project: {
          username: 1,
          email: 1,
          createdAt: 1,
          totalExpenses: { $ifNull: [{ $sum: '$expenses.amount' }, 0] },
          totalIncome: { $ifNull: [{ $sum: '$incomes.amount' }, 0] },
          balance: {
            $subtract: [
              { $ifNull: [{ $sum: '$incomes.amount' }, 0] },
              { $ifNull: [{ $sum: '$expenses.amount' }, 0] }
            ]
          }
        }
      },
      { $sort: { balance: -1 } }
    ]);

    res.json(userStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getOverallStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalExpenses = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalIncome = await Income.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const monthlyIncome = await Income.aggregate([
      {
        $group: {
          _id: { $month: '$date' },
          income: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthlyExpense = await Expense.aggregate([
      {
        $group: {
          _id: { $month: '$date' },
          expense: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const allMonths = Array.from(
      new Set([
        ...monthlyIncome.map(m => m._id),
        ...monthlyExpense.map(m => m._id)
      ])
    ).filter(Boolean).sort((a, b) => a - b);

    const monthlyStats = allMonths.map(month => {
      const inc = monthlyIncome.find(m => m._id === month)?.income || 0;
      const exp = monthlyExpense.find(m => m._id === month)?.expense || 0;
      return {
        month,
        income: inc,
        expense: exp
      };
    });

    res.json({
      totalUsers,
      totalExpenses: totalExpenses[0]?.total || 0,
      totalIncome: totalIncome[0]?.total || 0,
      monthlyStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

