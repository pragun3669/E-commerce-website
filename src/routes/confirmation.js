const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const Cart = require('../models/cart');
const uuid = require('uuid');
 // Use UUID to generate a unique order ID
const { v4: uuidv4 } = require('uuid');
const orderId = uuid.v4();
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

router.post('/place-order', isAuthenticated, async (req, res) => {
    try {
        const { address, payment } = req.body;
        const userId = req.user._id;

        if (!address || !payment || !userId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Fetch cart items for the user
        const cartItems = await Cart.find({ user: userId });

        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ error: 'No items found in the cart' });
        }

        // Prepare order items
        const orderItems = [];
        for (const cartItem of cartItems) {
            const product = await Product.findById(cartItem.productId);

            if (!product) {
                console.error(`Product not found for cart item: ${cartItem._id}`);
                continue;
            }

            orderItems.push({
                productId: product._id,
                quantity: cartItem.quantity,
                price: product.price
            });
        }

        // Calculate total amount
        const totalAmount = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Generate a unique order ID
        const orderId = uuidv4();

        // Create the new order
        const newOrder = new Order({
            orderId,
            userId,
            items: orderItems,
            totalAmount,
            address,
            paymentMethod: payment,
            orderedAt: new Date()
        });

        await newOrder.save();
        await Cart.deleteMany({ user: userId });

        // Pass the new order to the checkout page
        res.render('checkout', { order: newOrder });

    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Failed to place order' });
    }
});



// Function to calculate total amount based on order items
function calculateTotalAmount(orderItems) {
    return orderItems.reduce((total, orderItem) => {
        const itemPrice = orderItem.price || 0; // Ensure price exists or default to 0
        return total + (itemPrice * orderItem.quantity);
    }, 0).toFixed(2);
}

module.exports = router;
