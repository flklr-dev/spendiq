const express = require('express');
const router = express.Router();
const SavingsGoal = require('../models/SavingsGoal');
const auth = require('../middleware/auth');

// Get all savings goals
router.get('/', auth, async (req, res, next) => {
  try {
    const goals = await SavingsGoal.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: goals
    });
  } catch (error) {
    next(error);
  }
});

// Create savings goal
router.post('/', auth, async (req, res, next) => {
  try {
    const goal = new SavingsGoal({
      ...req.body,
      user: req.user.id,
      currentAmount: 0
    });

    await goal.save();

    res.status(201).json({
      success: true,
      data: goal
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

// Update savings goal
router.put('/:id', auth, async (req, res, next) => {
  try {
    const goal = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found'
      });
    }

    res.json({
      success: true,
      data: goal
    });
  } catch (error) {
    next(error);
  }
});

// Delete savings goal
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found'
      });
    }

    res.json({
      success: true,
      message: 'Savings goal deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 