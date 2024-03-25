const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.create({ email, password });
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch) throw new Error('Invalid credentials');
    // Redirigez vers la page de profil après une connexion réussie
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token }); 
    res.render('../views/profil', { user }); 

  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = router;
