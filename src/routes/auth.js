// routes/auth.js

const express = require('express');
const passport = require('../config/passport');
const User = require('../models/user'); // Replace with your User model
const bcrypt=require('bcrypt');
const flash = require('express-flash');
const router = express.Router();



// Signup route
router.get('/signup', (req, res) => {
    res.render('signup'); // Render your signup form (signup.ejs or any template)
});

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).send('User already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        user = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save the user to the database
        await user.save();

        // Redirect to login page or dashboard
        res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Login route
router.get('/login', (req, res) => {
    res.render('login'); // Render your login form (login.ejs or any template)
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/', // Redirect to home page after login
    failureRedirect: '/login', // Redirect to login page on failure
    failureFlash: true
}));

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.redirect('/'); // Redirect to home page even if there's an error
        }
        res.redirect('/'); // Redirect to home page after successful logout
    });
});

module.exports = router;
