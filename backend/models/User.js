const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' }, // e.g., Home, Office
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  addresses: [addressSchema] // Multiple addresses save panra array
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);