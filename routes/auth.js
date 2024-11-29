const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Hardcoded Admin Credentials (for testing purposes)
const adminEmail = 'admin@example.com';
const adminPassword = 'admin'; // Admin password stored in plain text for simplicity

// Registration Route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Save user with plain-text password (not secure)
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (process.env.NODE_ENV === 'development') {
      console.log('Login attempt:', { email, password });
    }

    let role = 'user'; // Default role

    // Check if the login is for the admin
    if (email === adminEmail && password === adminPassword) {
      role = 'admin'; // Set role to admin
    } else {
      // Look for the user in the database
      const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found for email:', email);
        return res.status(404).json({ message: 'User not found' });
      }

      // Compare plain-text passwords
      if (password !== user.password) {
        console.log(`Invalid password for email: ${email}`);
        return res.status(400).json({ message: 'Invalid password' });
      }

      role = user.role || 'user'; // Set role from database if present
    }

    // Generate JWT token for both admin and users
    const token = jwt.sign({ email, role }, 'secret_key', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', role, token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
