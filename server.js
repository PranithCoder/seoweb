const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const cors = require('cors');

// Connect to MongoDB


mongoose.connect('mongodb://localhost:27017/user_auth')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));





const app = express();
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

// Start Server
const PORT = 5500;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
