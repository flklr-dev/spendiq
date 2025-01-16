const app = require('./server');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server after successful database connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`CORS enabled for origin: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Close server & exit process
  process.exit(1);
});