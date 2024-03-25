const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const multer = require('multer');
const userIsLoggedIn = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});

const upload = multer({ storage: storage }); 

router.get('/list', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.render('Room/listRoom', { rooms: rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/Addrooms', upload.single('image'), async (req, res) => {
  try {
  
    const { nom, capacite, equipements, localisation, disponibilite } = req.body;
    const imageUrl = req.file.path; 

  
    const room = await Room.create({ nom, capacite, equipements, localisation, disponibilite, image: imageUrl });

    res.status(201).json({ room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/rooms/:id', async (req, res) => {
  try {
    const { nom, capacite, equipements, localisation, disponibilite, image } = req.body;
    const room = await Room.findByIdAndUpdate(req.params.id, { nom, capacite, equipements, localisation, disponibilite, image }, { new: true });
    res.json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Salle supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
