const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // உங்களது Product Model path சரியாக உள்ளதா எனச் சரிபார்க்கவும்

// 1. ADD NEW PRODUCT (POST)
// URL: http://localhost:5000/api/products/add
router.post('/add', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json({
      success: true,
      message: 'Product added successfully to database!',
      product: savedProduct
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to add product',
      error: err.message
    });
  }
});

// 2. GET ALL PRODUCTS (GET)
// URL: http://localhost:5000/api/products/get
router.get('/get', async (req, res) => {
  try {
    // புதிய ப்ராடக்ட்டுகள் முதலில் வரும்படி sort செய்யப்பட்டுள்ளது
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: err.message
    });
  }
});

// 3. UPDATE EXISTING PRODUCT (PUT) - Edit செய்வதற்கும் Stock குறைப்பதற்கும்
// URL: http://localhost:5000/api/products/update/:id
router.put('/update/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true } // அப்டேட் ஆன புதிய டேட்டாவைத் திரும்பப் பெற
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      product: updatedProduct
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: err.message
    });
  }
});

// 4. DELETE PRODUCT (DELETE)
// URL: http://localhost:5000/api/products/delete/:id
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully!'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: err.message
    });
  }
});

module.exports = router;