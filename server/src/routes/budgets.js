const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

// Get budget for a specific period
router.get('/period', auth, async (req, res, next) => {
  try {
    const { start, end } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: 'Start and end dates are required'
      });
    }

    // Convert string dates to Date objects
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Find budget for the period
    const budget = await Budget.findOne({
      user: req.user.id,
      'period.start': {
        $gte: startDate,
        $lt: new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
      },
      'period.end': {
        $gte: endDate,
        $lt: new Date(endDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    // If no budget exists, create an empty one
    if (!budget) {
      const newBudget = new Budget({
        user: req.user.id,
        period: {
          start: startDate,
          end: endDate
        },
        categories: [],
        totalBudget: 0,
        status: 'active'
      });
      await newBudget.save();
      
      return res.json({
        success: true,
        data: newBudget
      });
    }

    res.json({
      success: true,
      data: budget
    });
  } catch (error) {
    console.error('Budget period fetch error:', error);
    next(error);
  }
});

// Create or update budget
router.post('/', auth, async (req, res, next) => {
  try {
    const { period, categories, totalBudget } = req.body;
    
    if (!period?.start || !period?.end) {
      return res.status(400).json({
        success: false,
        message: 'Invalid period dates'
      });
    }

    // Convert string dates to Date objects
    const startDate = new Date(period.start);
    const endDate = new Date(period.end);

    // Find existing budget
    let budget = await Budget.findOne({
      user: req.user.id,
      'period.start': {
        $gte: startDate,
        $lt: new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
      },
      'period.end': {
        $gte: endDate,
        $lt: new Date(endDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (budget) {
      // Update existing budget
      budget.categories = categories;
      budget.totalBudget = totalBudget;
      await budget.save();
    } else {
      // Create new budget
      budget = new Budget({
        user: req.user.id,
        period: {
          start: startDate,
          end: endDate
        },
        categories,
        totalBudget
      });
      await budget.save();
    }
    
    res.status(201).json({
      success: true,
      data: budget
    });
  } catch (error) {
    console.error('Create/Update budget error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    next(error);
  }
});

// Update budget
router.put('/:id', auth, async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    res.json({
      success: true,
      data: budget
    });
  } catch (error) {
    next(error);
  }
});

// Delete budget
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    res.json({
      success: true,
      message: 'Budget deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 