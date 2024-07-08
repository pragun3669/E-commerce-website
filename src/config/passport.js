const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user'); // Replace with your User model

// Configure Passport Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'username', // Assuming you are using 'username' field for authentication
    passwordField: 'password' // Assuming you are using 'password' field for authentication
}, async (username, password, done) => {
    try {
        const user = await User.findOne({ username });

        if (!user || !user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect username or password' });
        }

        return done(null, user); // Authentication successful
    } catch (err) {
        return done(err);
    }
}));

// Serialization and deserialization of user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;
