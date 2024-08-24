const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product= require('../models/product');
const Cart=require('../models/cart');
const Order=require('../models/order');
const passport = require('../config/passport');
// Home page route
router.get('/', (req, res) => {
    res.render('home'); // Render home.ejs template
});

// Shop page route

// Example protected route
router.get('/shop', isAuthenticated, async (req, res) => {
    try {
      //  const Product = await Product.find(); // Retrieve products
        res.render('shop', { username: req.user.username, Product });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Example protected route
router.get('/sidebar', isAuthenticated, async (req, res) => {
    try {
      //  const Product = await Product.find(); // Retrieve products
        res.render('sidebar', { username: req.user.username, Product });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/login', (req, res) => {
    // Fetch Product from database and pass them to the template
    res.render('login', { User });
});

router.get('/signup', (req, res) => {
    // Fetch Product from database and pass them to the template
    res.render('signup', { User });
});// Example protected route
router.get('/cart', isAuthenticated, async (req, res) => {
    try {
        // Fetch cart items associated with the logged-in user
        const cartItems = await Cart.find({ user: req.user._id }).populate('productId');

        // Render 'cart' view with cartItems data
        res.render('cart', { username: req.user.username, cartItems });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ error: 'Failed to fetch cart items' });
    }
});

router.get('/checkout', async (req, res) => {
    try {
        // Fetch the order from the session or database
        const orderId = req.session.orderId; // Example: Assuming order ID is stored in the session
        const order = await Order.findById(orderId).populate('items.productId'); // Populate the product details

        if (order) {
            res.render('checkout', { order });
        } else {
            req.flash('error', 'No order found.');
            res.redirect('/cart');
        }
    } catch (error) {
        console.error('Error fetching the order:', error);
        req.flash('error', 'An error occurred while processing your order.');
        res.redirect('/cart');
    }
});

router.get('/cart/buy', isAuthenticated, async (req, res) => {
    try {
        const cartItems = await Cart.find({ user: req.user._id }).populate('productId');
        console.log('Cart Items:', cartItems);
        res.render('buy', { username: req.user.username,userId: req.user._id,cartItems,Product});
    } catch (error) {
        console.error('Error fetching cart items for buy:', error);
        res.status(500).json({ error: 'Failed to fetch cart items' });
    }
});

// Example protected route
router.get('/aboutcontact', isAuthenticated, async (req, res) => {
    try {
        // Retrieve products
        res.render('aboutcontact', { username: req.user.username});
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
// Example protected route
router.get('/search', isAuthenticated, async (req, res) => {
    try {
       // const Product = await Product.find(); // Retrieve products
        res.render('search', { username: req.user.username, Product });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
// Example protected route
router.get('/productdetails', isAuthenticated, async (req, res) => {
    try {
        
        res.render('productdetails', { username: req.user.username, Product });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
// Example isAuthenticated middleware
function isAuthenticated(req, res, next) {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware
    }
    // User is not authenticated, redirect to login page or handle accordingly
    res.redirect('/auth/login'); // Redirect to login page if not authenticated
}


module.exports = router;
