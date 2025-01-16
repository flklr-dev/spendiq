const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Goal name is required']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [0, 'Target amount must be positive']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount must be positive']
  },
  targetDate: {
    type: Date,
    required: [true, 'Target date is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Emergency', 'Travel', 'Education', 'Home', 'Vehicle', 'Retirement', 'Other']
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: ['Low', 'Medium', 'High']
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);