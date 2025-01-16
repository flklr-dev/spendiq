const mongoose = require('mongoose');

const aiInsightSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['spending', 'saving', 'budget', 'investment', 'debt', 'general']
  },
  category: {
    type: String,
    required: true,
    enum: ['alert', 'recommendation', 'prediction', 'achievement']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  recommendations: [{
    title: String,
    description: String,
    impact: {
      type: Number,
      min: 0,
      max: 100
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    },
    timeframe: String,
    potentialSavings: Number
  }],
  metrics: {
    savingsPotential: Number,
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    impactScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  relatedData: {
    transactions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }],
    categories: [String],
    trends: [{
      name: String,
      value: Number,
      change: Number
    }]
  },
  period: {
    start: Date,
    end: Date
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'dismissed'],
    default: 'active'
  },
  userAction: {
    taken: {
      type: Boolean,
      default: false
    },
    date: Date,
    notes: String
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
aiInsightSchema.index({ user: 1, type: 1, status: 1 });
aiInsightSchema.index({ user: 1, 'period.start': 1, 'period.end': 1 });

module.exports = mongoose.model('AIInsight', aiInsightSchema); 