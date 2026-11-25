const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config(); // 👈 இங்கே பிராக்கெட் சரியாக மாற்றப்பட்டுள்ளது

const app = express();

// Middleware
app.use(cors({
  origin: '*', // அனைத்து ஃப்ரெண்ட்என்ட் ஒரிஜின்களையும் அனுமதிக்க
  credentials: true
}));

// 100mb லிமிட்
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));

// ROUTE (sign up & login & products)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fashion-ecommerce';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });