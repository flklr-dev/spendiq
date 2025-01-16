const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['monthly', 'quarterly', 'yearly', 'custom']
  },
  period: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  data: {
    summary: {
      totalIncome: Number,
      totalExpenses: Number,
      netSavings: Number,
      savingsRate: Number,
      healthScore: Number
    },
    monthlyData: [{
      month: String,
      income: Number,
      expenses: Number
    }],
    expenseCategories: [{
      name: String,
      value: Number,
      color: String
    }],
    transactions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }],
    savingsGoals: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SavingsGoal'
    }]
  },
  format: {
    type: String,
    enum: ['pdf', 'csv', 'json'],
    default: 'pdf'
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'generating'
  },
  downloadUrl: String
}, {
  timestamps: true
});

// Add indexes for better query performance
reportSchema.index({ user: 1, 'period.start': 1, 'period.end': 1 });
reportSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('Report', reportSchema);