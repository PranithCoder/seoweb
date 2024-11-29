

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' } // Default role is 'user', 'admin' role is manually assigned
});

// No password hashing here. Passwords are stored as plain text.

module.exports = mongoose.model('User', userSchema);

