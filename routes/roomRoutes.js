const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Room = require('../models/Room');
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});

const upload = multer({ storage: storage }); 
const isAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); 
    if (decodedToken.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Not an admin.' });
    }
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};



router.get('/list', async (req, res) => {
  try {
    
    const token = req.cookies.token;
    let user = null;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      
      user = {
        userId: decodedToken.userId,
        role: decodedToken.role
      };
    }
    
    const rooms = await Room.find();
   
    res.render('Room/listRoom', { rooms: rooms, user: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/Addrooms', isAdmin, upload.single('image'), async (req, res) => {
  try {
  
    const { nom, capacite, equipements,description ,localisation } = req.body;
    const imageUrl = req.file.path; 

  
    const room = await Room.create({ nom, capacite, equipements, description,localisation, image: imageUrl });
    res.redirect('/api/crudRoom/list');
   
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/Updaterooms/:id', isAdmin,upload.single('image') ,async (req, res) => {
  try {
    const { nom, capacite, equipements,description, localisation} = req.body;
    const imageUrl = req.file.path; 
    const room = await Room.findByIdAndUpdate(req.params.id, { nom, capacite, equipements,description,localisation,  image: imageUrl }, { new: true });
    res.redirect('/api/crudRoom/list');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/Deleterooms/:id', isAdmin, async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    res.redirect('/api/crudRoom/list');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/updateGetRoom/:id', isAdmin, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Chambre non trouvée' });
    }
    res.render('Room/updateRoom', { room: room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;