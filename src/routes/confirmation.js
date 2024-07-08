const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const Cart=require('../models/cart');
const uuid = require('uuid');
// Assuming your Order model is correctly defined
 // Assuming you have an isAuthenticated middleware

// POST /place-order route to handle order placement
router.post('/place-order/:id',isAuthenticated, async (req, res) => {
    try { 
        // Extract necessary information from request
        const { address, payment } = req.body; // Extract userId, address, and payment
        const userId=req.user._id;
        const productId=req.params.id;
        const orderId = uuid.v4();
        // Validate if userId, address, and payment exist
        if (!userId || !address || !payment) {
            console.log(userId);
            console.log(address);
            console.log(payment);
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const orderItems = await Cart.find({ user: req.user._id });

        if (!orderItems || orderItems.length === 0) {
            return res.status(404).json({ error: 'No items found in the cart' });
        }
        // Check if orderItems exists and is an array
     

        // Iterate through cart items and create order items
        for (const orderitem of orderItems) {
            const product = await Product.findById(orderitem.productId);

            if (!product) {
                // Handle case where product is not found (optional)
                console.log(`Product not found for cart item: ${orderitem._id}`);
                continue;
            }

            // Push the required details into order items array
            orderItems.push({
                productId: product._id,
                quantity: orderitem.quantity,
                price: product.price // Assuming price is stored in Product model
            });
        }

        const totalAmount = calculateTotalAmount(orderItems);


        // Create a new order instance
        const newOrder = new Order({
            orderId:orderId,
            userId: userId, // Use userId from form submission
            items: orderItem,
            totalAmount: totalAmount, // Function to calculate total amount
            address: address,
            paymentMethod: payment,
            orderedAt: new Date()
            // Add other relevant fields as needed
        });

        // Save the order to the database
        await newOrder.save();

        // Clear the cart items from session after placing order
    // Clear cart items from session

        // Redirect to a confirmation page or render a success message
        res.redirect('/confirmation'); // Redirect to confirmation page after placing order

    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Failed to place order' });
    }
}); 
  
// Function to calculate total amount based on cart items
function calculateTotalAmount(orderItems) {
    return orderItems.reduce((total, orderItem) => {
        const itemPrice = orderItem.productId.price || 0; // Ensure price exists or default to 0
        return total + (itemPrice * orderItem.quantity);
    }, 0).toFixed(2);
}


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
