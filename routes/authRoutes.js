const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const logoutMiddleware = require('../middleware/logoutMiddleware');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    let { firstname, lastname, email, password, birthdate, role } = req.body;
    if (email === 'admin@gmail.com') {
      role = 'admin'; 
    }
    const user = await User.create({ firstname, lastname, email, password, birthdate, role });

    res.redirect('/login'); 
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

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(token);
    res.cookie('token', token); 
    res.redirect('/api/auth/profil'); 
    //res.status(200).json({ token }); 
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

router.get('/profil', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/login');  // Rediriger vers la page de connexion si le token est manquant
    }
   
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.userId);
    if (!user) throw new Error('User not found');
    res.render('profil', { user });
  } catch (error) {
    res.redirect('/login'); 
  }
});
router.post('/logout', logoutMiddleware);

module.exports = router;
