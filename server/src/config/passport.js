const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Only configure Google Strategy if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Check if user exists with same email
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            await user.save();
          } else {
            // Create new user
            user = await new User({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value,
            }).save();
          }
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  ));
} else {
  console.log('Google OAuth credentials not found. Google authentication will be disabled.');
}

module.exports = passport; 