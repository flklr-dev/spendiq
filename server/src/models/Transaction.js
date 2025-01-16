const mongoose = require('mongoose');

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Business',
  'Rental',
  'Other Income'
];

const EXPENSE_CATEGORIES = [
  'Groceries',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Rent',
  'Shopping',
  'Restaurant',
  'Healthcare',
  'Other'
];

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  category: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        if (this.type === 'income') {
          return INCOME_CATEGORIES.includes(value);
        } else if (this.type === 'expense') {
          return EXPENSE_CATEGORIES.includes(value);
        }
        return false;
      },
      message: props => {
        const type = props.type || 'transaction';
        return `${props.value} is not a valid category for ${type}`;
      }
    }
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: [
      'Credit Card',
      'Debit Card',
      'Cash',
      'Bank Transfer',
      'Mobile Payment',
      'Check',
      'Digital Payment'
    ]
  },
  status: {
    type: String,
    default: 'completed',
    enum: ['pending', 'completed', 'failed', 'cancelled']
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    url: String,
    type: String,
    name: String
  }],
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly', null],
      default: null
    },
    lastProcessed: {
      type: Date,
      default: null
    }
  },
  budgetCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget.categories',
    required: function() {
      return this.type === 'expense';
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });
transactionSchema.index({ user: 1, type: 1 });

// Add these as static properties for reuse
transactionSchema.statics.INCOME_CATEGORIES = INCOME_CATEGORIES;
transactionSchema.statics.EXPENSE_CATEGORIES = EXPENSE_CATEGORIES;

// Add a method to handle recurring transactions
transactionSchema.methods.processRecurring = async function() {
  if (!this.recurring.isRecurring || !this.recurring.frequency) return;
  
  const now = new Date();
  const lastProcessed = this.recurring.lastProcessed || this.date;
  
  // Check if it's time to create a new transaction based on frequency
  let shouldProcess = false;
  switch (this.recurring.frequency) {
    case 'monthly':
      shouldProcess = now.getMonth() > lastProcessed.getMonth() || 
                     now.getFullYear() > lastProcessed.getFullYear();
      break;
    // Add other frequency cases as needed
  }
  
  if (shouldProcess && (!this.recurring.endDate || now <= this.recurring.endDate)) {
    const newTransaction = new this.constructor({
      ...this.toObject(),
      date: now,
      recurring: {
        ...this.recurring,
        lastProcessed: now
      }
    });
    await newTransaction.save();
    
    // If it's income, update the budget
    if (this.type === 'income') {
      const budget = await Budget.findOne({
        user: this.user,
        'period.start': { $lte: now },
        'period.end': { $gte: now }
      });
      
      if (budget) {
        budget.totalIncome += this.amount;
        await budget.save();
      }
    }
  }
};

module.exports = mongoose.model('Transaction', transactionSchema);