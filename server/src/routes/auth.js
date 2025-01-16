const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Validation middleware
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

// Register route
router.post('/register', validateRegistration, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: errors.array()[0].msg 
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ 
        success: false,
        error: 'Email is already registered' 
      });
    }

    // Create new user
    user = new User({
      name,
      email: email.toLowerCase(),
      password,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error during registration' 
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update login history
    user.security.lastLogin = new Date();
    user.security.loginHistory.push({
      timestamp: new Date(),
      ip: req.ip,
      device: req.headers['user-agent'],
      location: 'Unknown' // You can integrate with a geolocation service
    });
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google OAuth routes - only enable if credentials exist
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    async (req, res) => {
      try {
        const token = jwt.sign(
          { userId: req.user._id },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
      } catch (error) {
        console.error('Google callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=true`);
      }
    }
  );
} else {
  router.get('/google', (req, res) => {
    res.status(501).json({ message: 'Google authentication is not configured' });
  });

  router.get('/google/callback', (req, res) => {
    res.status(501).json({ message: 'Google authentication is not configured' });
  });
}

module.exports = router; 