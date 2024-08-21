const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const Cart = require('../models/cart');
const uuid = require('uuid');

// Middleware for authentication
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware
    }
    res.redirect('/auth/login'); // Redirect to login page if not authenticated
}

// Example route for checkout page
router.get('/checkout', isAuthenticated, async (req, res) => {
    try {
        // Optionally, fetch additional data or order details if needed
        res.render('checkout', { title: 'Order Confirmation', username: req.user.username });
    } catch (error) {
        console.error('Error rendering checkout page:', error);
        res.status(500).json({ error: 'Failed to render checkout page' });
    }
});

// POST /place-order route to handle order placement
router.post('/place-order', isAuthenticated, async (req, res) => {
    try {
        const { address, payment } = req.body;
        const userId = req.user._id;
        const orderId = uuid.v4();

        // Validate if userId, address, and payment exist
        if (!userId || !address || !payment) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Get items from the cart
        const cartItems = await Cart.find({ user: userId });

        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ error: 'No items found in the cart' });
        }

        // Prepare order items
        const orderItems = [];
        for (const cartItem of cartItems) {
            const product = await Product.findById(cartItem.productId);

            if (!product) {
                console.log(`Product not found for cart item: ${cartItem._id}`);
                continue;
            }

            orderItems.push({
                productId: product._id,
                quantity: cartItem.quantity,
                price: product.price // Assuming price is stored in Product model
            });
        }

        const totalAmount = calculateTotalAmount(orderItems);

        // Create a new order instance
        const newOrder = new Order({
            orderId: orderId,
            userId: userId,
            items: orderItems,
            totalAmount: totalAmount,
            address: address,
            paymentMethod: payment,
            orderedAt: new Date()
        });

        // Save the order to the database
        await newOrder.save();

        // Clear the cart items from the database
        await Cart.deleteMany({ user: userId });

        // Redirect to a confirmation page or render a success message
        res.redirect('/checkout');

    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Failed to place order' });
    }
});

// Function to calculate total amount based on cart items
function calculateTotalAmount(orderItems) {
    return orderItems.reduce((total, orderItem) => {
        const itemPrice = orderItem.price || 0; // Ensure price exists or default to 0
        return total + (itemPrice * orderItem.quantity);
    }, 0).toFixed(2);
}

module.exports = router;
