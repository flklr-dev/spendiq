const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all transactions
router.get('/', auth, async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 });

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
});

// Add Income
router.post('/income', auth, async (req, res, next) => {
  try {
    const { amount, description, category, paymentMethod, date, recurring } = req.body;

    // Validate required fields
    if (!amount || !description || !category || !paymentMethod || !date) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate amount is a number
    if (isNaN(parseFloat(amount))) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a valid number'
      });
    }

    // Validate category is in the allowed income categories
    const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Business', 'Rental', 'Other Income'];
    if (!incomeCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid income category'
      });
    }

    // Create the income data object
    const incomeData = {
      user: req.user.id,
      amount: Math.abs(parseFloat(amount)),
      description,
      category,
      paymentMethod,
      type: 'income',
      date: new Date(date),
      status: 'completed',
      recurring: {
        isRecurring: recurring?.isRecurring || false,
        frequency: recurring?.isRecurring ? 'monthly' : null
      }
    };

    const transaction = new Transaction(incomeData);
    await transaction.save();

    // Update current budget with new income
    const budget = await Budget.findOne({
      user: req.user.id,
      'period.start': { $lte: new Date(date) },
      'period.end': { $gte: new Date(date) }
    });

    if (budget) {
      budget.totalIncome += Math.abs(parseFloat(amount));
      await budget.save();
    }

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Income added successfully'
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    next(error);
  }
});

// Add Expense
router.post('/expense', auth, upload.single('attachment'), async (req, res, next) => {
  try {
    const { amount, description, category, paymentMethod, date } = req.body;
    
    // Find current budget period
    const budget = await Budget.findOne({
      user: req.user.id,
      'period.start': { $lte: new Date(date) },
      'period.end': { $gte: new Date(date) }
    });

    if (!budget) {
      return res.status(400).json({
        success: false,
        message: 'No budget found for this period. Please set up a budget first.'
      });
    }

    // Find budget category
    const budgetCategory = budget.categories.find(c => c.name === category);
    if (!budgetCategory) {
      return res.status(400).json({
        success: false,
        message: 'Invalid budget category'
      });
    }

    // Check if expense exceeds budget
    const newSpentAmount = budgetCategory.spentAmount + Math.abs(parseFloat(amount));
    if (newSpentAmount > budgetCategory.plannedAmount) {
      return res.status(400).json({
        success: false,
        message: `This expense would exceed the budget for ${category}. Remaining budget: $${(budgetCategory.plannedAmount - budgetCategory.spentAmount).toFixed(2)}`
      });
    }

    const expenseData = {
      user: req.user.id,
      amount: -Math.abs(parseFloat(amount)), // Ensure negative amount
      description,
      category,
      paymentMethod,
      type: 'expense',
      date: new Date(date),
      status: 'completed'
    };

    if (req.file) {
      expenseData.attachments = [{
        url: `/uploads/${req.file.filename}`,
        type: req.file.mimetype,
        name: req.file.originalname
      }];
    }

    // Create and save the transaction
    const transaction = new Transaction(expenseData);
    await transaction.save();

    // Update budget category spent amount
    budgetCategory.spentAmount = newSpentAmount;
    await budget.save();

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Expense added successfully'
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    next(error);
  }
});

// Update transaction
router.put('/:id', auth, upload.single('attachment'), async (req, res, next) => {
  try {
    const oldTransaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!oldTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // If it's an expense, update old budget category
    if (oldTransaction.type === 'expense') {
      const oldBudget = await Budget.findOne({
        user: req.user.id,
        'period.start': { $lte: oldTransaction.date },
        'period.end': { $gte: oldTransaction.date }
      });

      if (oldBudget) {
        const oldCategory = oldBudget.categories.find(c => c.name === oldTransaction.category);
        if (oldCategory) {
          oldCategory.spentAmount -= Math.abs(oldTransaction.amount);
          await oldBudget.save();
        }
      }
    }

    // Update the transaction
    const updatedData = {
      ...req.body,
      amount: req.body.type === 'income' 
        ? Math.abs(parseFloat(req.body.amount))
        : -Math.abs(parseFloat(req.body.amount))
    };

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updatedData,
      { new: true, runValidators: true }
    );

    // If it's an expense, update new budget category
    if (transaction.type === 'expense') {
      const newBudget = await Budget.findOne({
        user: req.user.id,
        'period.start': { $lte: transaction.date },
        'period.end': { $gte: transaction.date }
      });

      if (newBudget) {
        const newCategory = newBudget.categories.find(c => c.name === transaction.category);
        if (newCategory) {
          newCategory.spentAmount += Math.abs(transaction.amount);
          await newBudget.save();
        }
      }
    }

    res.json({
      success: true,
      data: transaction,
      message: 'Transaction updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // If it's an expense, update the budget
    if (transaction.amount < 0) {
      const budget = await Budget.findOne({
        user: req.user.id,
        'period.start': { $lte: transaction.date },
        'period.end': { $gte: transaction.date }
      });

      if (budget) {
        const category = budget.categories.find(c => c.name === transaction.category);
        if (category) {
          category.spentAmount -= Math.abs(transaction.amount);
          await budget.save();
        }
      }
    }

    await Transaction.deleteOne({ _id: req.params.id, user: req.user.id });

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get total income for a period
router.get('/income/total', auth, async (req, res, next) => {
  try {
    const { start, end } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: 'Start and end dates are required'
      });
    }

    const totalIncome = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'income',
          date: {
            $gte: new Date(start),
            $lte: new Date(end)
          }
        }
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      success: true,
      totalIncome: totalIncome[0]?.totalIncome || 0
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 