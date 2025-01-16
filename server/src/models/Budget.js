const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  categories: [{
    name: {
      type: String,
      required: true,
      enum: [
        'Groceries',
        'Transportation',
        'Utilities',
        'Entertainment',
        'Rent',
        'Shopping',
        'Restaurant',
        'Healthcare',
        'Other'
      ]
    },
    plannedAmount: {
      type: Number,
      required: true,
      min: 0
    },
    spentAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    notes: String,
    isRecurring: {
      type: Boolean,
      default: false
    }
  }],
  totalBudget: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  metrics: {
    savingsRate: Number,
    spendingRate: Number,
    monthOverMonthChange: Number
  }
}, {
  timestamps: true
});

// Add method to calculate period dates
budgetSchema.statics.calculatePeriodDates = function(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start, end };
};

// Add method to copy recurring categories
budgetSchema.methods.copyRecurringCategories = async function() {
  const nextMonth = new Date(this.period.end);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  
  const { start, end } = this.constructor.calculatePeriodDates(nextMonth);
  
  const recurringCategories = this.categories.filter(cat => cat.isRecurring);
  
  if (recurringCategories.length > 0) {
    const newBudget = new this.constructor({
      user: this.user,
      period: { start, end },
      categories: recurringCategories,
      totalBudget: recurringCategories.reduce((sum, cat) => sum + cat.plannedAmount, 0)
    });
    
    await newBudget.save();
    return newBudget;
  }
  
  return null;
};

// Add indexes for better query performance
budgetSchema.index({ user: 1, 'period.start': 1, 'period.end': 1 });
budgetSchema.index({ user: 1, status: 1 });

// Add validation for unique category names within a budget
budgetSchema.path('categories').validate(function(categories) {
  const names = categories.map(cat => cat.name);
  return new Set(names).size === names.length;
}, 'Category names must be unique within a budget');

// Add method to update from recurring income
budgetSchema.methods.updateFromRecurringIncome = async function() {
  const recurringIncome = await Transaction.find({
    user: this.user,
    type: 'income',
    'recurring.isRecurring': true,
    date: { $lte: this.period.end }
  });
  
  for (const income of recurringIncome) {
    await income.processRecurring();
  }
};

module.exports = mongoose.model('Budget', budgetSchema); 