// auth.js or routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password,location } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword,location,});
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user:newUser});
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Login
// console.log("Entered password:", password);
// console.log("Stored hash from DB:", user.password);
// const isMatch = await bcrypt.compare(password, user.password);
// console.log("bcrypt.compare result:", isMatch);
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(" Login payload:", { email, password });
  try {
    const user = await User.findOne({ email });
    console.log(" Stored hash from DB:", user ? user.password : null);
    if (!user) {
      console.log(" User not found");
      return res.status(400).json({ message: 'Invalid credentials (user not found)' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(" bcrypt.compare result:", isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials (password mismatch)' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    console.log(" Login successful, token issued");
    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: 'Server error during login' });
  }
});
router.get("/allusers", async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});



module.exports = router;
