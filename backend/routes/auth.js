const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- AUTH MIDDLEWARE (Token verify panna) ---
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied! No token provided.' });

  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'secretkey123');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token!' });
  }
};

// 1. SIGN UP ROUTE (US-01)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // --- EXTRA CODE ADDED: Signup aanavudane Token & User details anuppa ---
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || 'secretkey123',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
    // ----------------------------------------------------------------------

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. LOGIN ROUTE (US-01)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'secretkey123', 
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET USER PROFILE & ADDRESSES
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found!' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. UPDATE ACCOUNT DETAILS (First Name, Last Name, Email, Password)
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, name, email, currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found!' });

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;

    // Password change request iruntha
    if (newPassword && newPassword.trim() !== '') {
      if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
      }
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password!' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password!' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully!', user: { name: user.name, email: user.email, firstName: user.firstName, lastName: user.lastName } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. ADD NEW ADDRESS TO USER
router.post('/address', verifyToken, async (req, res) => {
  try {
    const { label, firstName, lastName, street, city, postalCode, phone, isDefault } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found!' });

    // Oru vela ithu default address-ah iruntha, maththa addresses-oda default-ah false aakkidalam
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push({ label, firstName, lastName, street, city, postalCode, phone, isDefault });
    await user.save();

    res.status(200).json({ message: 'Address added successfully!', addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. DELETE ADDRESS
router.delete('/address/:addressId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found!' });

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
    await user.save();

    res.status(200).json({ message: 'Address deleted successfully!', addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;