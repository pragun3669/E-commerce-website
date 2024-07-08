const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['credit', 'debit', 'paypal'], // Add more options as needed
        required: true
    },
    orderedAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
