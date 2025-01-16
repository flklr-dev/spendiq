const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'budget_alert',
      'savings_milestone',
      'unusual_spending',
      'bill_reminder',
      'goal_progress',
      'ai_insight',
      'security_alert',
      'system'
    ]
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  read: {
    type: Boolean,
    default: false
  },
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  action: {
    type: {
      type: String,
      enum: ['link', 'button', 'none'],
      default: 'none'
    },
    text: String,
    url: String
  },
  delivery: {
    email: {
      sent: Boolean,
      timestamp: Date
    },
    push: {
      sent: Boolean,
      timestamp: Date
    },
    sms: {
      sent: Boolean,
      timestamp: Date
    }
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days from creation
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });
notificationSchema.index({ user: 1, type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

module.exports = mongoose.model('Notification', notificationSchema); 