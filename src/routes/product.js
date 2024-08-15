const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const User = require('../models/user');
const mongoose = require('mongoose');

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST multiple new products
router.post('/', async (req, res) => {
    const products = req.body.products;

    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'No products to insert' });
    }

    try {
        const newProducts = await Product.insertMany(products);
        res.status(201).json(newProducts);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET a product by ID
router.get('/:productId', async (req, res) => {
    const productId = req.params.productId;

    // Validate productId before using it
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid productId' });
    }

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE a product by ID
router.delete('/:id', getProduct, async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST search products
router.post('/search', async (req, res) => {
    const { searchQuery } = req.body;

    try {
        const products = await Product.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } }
            ]
        });

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get a product by ID
async function getProduct(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.params.id);
        if (product == null) {
            return res.status(404).json({ message: 'Cannot find product' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.product = product;
    next();
}

module.exports = router;

