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
mongoose.connect('mongodb://localhost:27017/myplace_in', {
   
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Initialize MongoStore with session
const sessionStore = MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/myplace_in',
    collectionName: 'sessions', // Optional, the default is 'sessions'
    ttl: 24 * 60 * 60, // Session TTL (time to live) in seconds (1 day)
});

// Configure session middleware
app.use(session({
    secret: 'PRAGUNSINGH', // Replace with a random string
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // Session expires after 1 day
}));

// Event handlers for MongoDB connection

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static((__dirname, 'public')));
// Use session middleware
app.use(express.static(path.join(__dirname, 'public')));

// Route to render home.ejs
app.get('/home', (req, res) => {
    res.render('home'); // Assumes home.ejs is in 'views' folder
});

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
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
