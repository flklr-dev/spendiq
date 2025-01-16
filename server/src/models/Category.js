const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null for default categories
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  budgetDefaults: {
    suggested: Number,
    min: Number,
    max: Number
  },
  description: String,
  tags: [String],
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
categorySchema.index({ user: 1, type: 1, status: 1 });
categorySchema.index({ isDefault: 1, type: 1 });

module.exports = mongoose.model('Category', categorySchema); 