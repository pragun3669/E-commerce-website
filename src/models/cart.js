const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Replace with the actual name of your User model
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Replace with the actual name of your Product model
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('Cart', cartSchema);
