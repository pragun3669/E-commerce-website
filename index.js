const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');
const flash = require('express-flash');
const MongoStore = require('connect-mongo');
const passport = require('passport'); // Adjust path as needed
const authRoutes = require('./src/routes/auth');
const products=require('./src/routes/product');
const cart=require('./src/routes/carts');
const index=require('./src/routes/index');
const sidebar=require('./src/routes/sidebar');
const confirmation=require('./src/routes/confirmation');
const uuid=require('uuid');
const app = express();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB using Mongoose


mongoose.connect('mongodb://localhost/myplace_in');

// Initialize MongoStore with session
const sessionStore = MongoStore.create({
    mongoUrl: 'mongodb://localhost/myplace_in',
    collectionName: 'sessions', // Optional, the default is 'sessions'
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // Session TTL (time to live) in seconds (default is 14 days)
});

// Configure session middleware
app.use(session({
    secret: 'your_secret_key', // Replace with a random string (used to sign the session ID cookie)
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // Session expires after 1 day (adjust as needed)
}));


//const auth = require('../middleware/auth');

//Configure session middleware
 
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static((__dirname, 'public')));
// Use session middleware

//Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views')); // Assuming your EJS files are in the 'views' directory
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());

// Routes

app.use('/products',products);
app.use('/',index);
app.use('/auth', authRoutes); // Mount authentication routes
app.use('/cart',cart);
app.use('/shop',sidebar);
app.use('/',confirmation);
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
