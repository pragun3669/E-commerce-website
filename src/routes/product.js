const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const User=require('../models/user');
const mongoose=require('mongoose');
// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new product
router.post('/', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.get('/:productId', async (req, res) => {
    const productId = req.params.productId;

    // Validate productId before using it
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid productId' });
    }

    try {
        // Find the product by its ObjectId
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Send the product details as JSON response
        res.json(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE a product
router.delete('/:id', getProduct, async (req, res) => {
    try {
        const productId = req.params.id;
        // Example: Delete product by productId
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
        // Perform a search query based on your requirements
        const products = await Product.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search by product name
                { description: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search by description
                // Add more fields if needed
            ]
        });

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/productdetails/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        // Validate if productId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid Product ID' });
        }

        // Fetch product details using the productId
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product); // Send product details as JSON response
    } catch (error) {
        console.error('Error fetching product details:', error.message);
        res.status(500).json({ error: 'Server error' });
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
