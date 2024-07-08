const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Replace with your product model


// Route for searching by category
router.get('/sidebar/:category', async (req, res) => {
    const category = req.params.category;

    try {
        const products = await Product.find({ category }); // Query products by category
        res.json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Route for filtering by price
router.get('/filter', async (req, res) => {
    const { minPrice, maxPrice } = req.query;

    try {
        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }
        }); // Query products within price range
        res.json(products);
    } catch (error) {
        console.error('Error filtering products by price:', error);
        res.status(500).json({ error: 'Failed to filter products' });
    }
});
router.get('/:category', async (req, res) => {
    try {
        const { category } = req.query; // Get category from query string

        let products;
        if (category && category !== 'all') {
            products = await Product.find({ category: category });
        } else {
            products = await Product.find();
        }
        
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
