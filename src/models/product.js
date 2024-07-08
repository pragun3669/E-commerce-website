const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    quantity: { type: Number } 
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
