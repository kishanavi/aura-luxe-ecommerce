const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // MEN, WOMEN, etc.
  subCategory: { type: String },              // Shirts, Frocks, etc.
  description: { type: String },
  price: { type: Number, required: true },
  isOnSale: { type: Boolean, default: false },
  salePrice: { type: Number, default: 0 },
  isNewArrival: { type: Boolean, default: false },
  sizeGuideImage: { type: String },            // Base64 or URL
  colors: [
    {
      colorName: { type: String, required: true },
      image: { type: String, required: true },
      sizes: {
        S: { type: Number, default: 0 },
        M: { type: Number, default: 0 },
        L: { type: Number, default: 0 },
        XL: { type: Number, default: 0 }
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);