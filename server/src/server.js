const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const budgetRoutes = require('./routes/budgets');
const savingsGoalsRoutes = require('./routes/savingsGoals');
const transactionsRoutes = require('./routes/transactions');
const path = require('path');
require('dotenv').config();
const fs = require('fs');


const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200
};

// Apply CORS before routes
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Other middleware
app.use(passport.initialize());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// Pre-flight requests
app.options('*', cors(corsOptions));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/savings-goals', savingsGoalsRoutes);
app.use('/api/transactions', transactionsRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SpendIQ API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid JSON payload' 
    });
  }
  
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Something went wrong!' 
  });
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;