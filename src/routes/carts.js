const express = require('express');
const router = express.Router();
const User=require('../models/user');
const Product = require('../models/product'); // Assuming you have a Product model defined
const Cart = require('../models/cart'); // Assuming you have a Cart model defined
const mongoose=require('mongoose');

router.post('/add', isAuthenticated, async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // Assuming req.user contains user information

    try {
        // Check if the product already exists in the cart for the user (if applicable)
        let cartItem = await Cart.findOne({ user: userId, productId });

        if (cartItem) {
            // If product exists, update the quantity
            cartItem.quantity += quantity;
        } else {
            // If product doesn't exist, create a new cart item
            cartItem = new Cart({ user: userId, productId, quantity }); // Set user field to userId
        }

        // Save the cart item to the database
        await cartItem.save();

        // Respond with success message
        res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Failed to add product to cart' });
    }
});
router.get('/buy/cart', isAuthenticated, async (req, res) => {
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

router.post('/remove/:id', isAuthenticated, async (req, res) => {
    const cartItemId = req.params.id;

    try {
        // Ensure the cart item belongs to the logged-in user
        const cartItem = await Cart.findOne({ _id: cartItemId, user: req.user._id });

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found or you are not authorized to remove it' });
        }

        // Decrement the quantity by 1 if it's greater than 1
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            // If quantity is 1, remove the entire cart item
            await cartItem.deleteOne();
        }

        // Save the updated cart item
        await cartItem.save();

        // Redirect back to the cart page or you can send a success message
        res.redirect('/cart');
    } catch (error) {
        console.error('Error removing cart item:', error);
        res.status(500).json({ error: 'Failed to remove cart item' });
    }
});


router.get('/:id', isAuthenticated, async (req, res) => {
    const userId = req.user.id; // Assuming req.user contains the logged-in user's details

    try {
        // Fetch cart items associated with the logged-in user
        const cartItems = await Cart.find({ user: userId }).populate('productId');

        // Render 'buy' view with cartItems data
        res.render('checkout', { username: req.user.username, cartItems });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ error: 'Failed to fetch cart items' });
    }
});

router.get('/buy/:id', async (req, res) => {
    const cartItemId = req.params.id;

    // Validate if cartItemId is a valid ObjectId
    if (!mongoose.isValidObjectId(cartItemId)) {
        return res.status(400).send('Invalid cart item ID');
    }

    try {
        const cartItem = await Cart.findById(cartItemId).populate('productId');
        
        if (!cartItem) {
            return res.status(404).send('Cart item not found');
        }
        
        // Render buy.ejs with cartItem data
        res.render('buy', { cartItem });
    } catch (error) {
        console.error('Error fetching cart item for buy:', error);
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
