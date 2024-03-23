
const express = require('express');
const router = express.Router();
const Room = require('../models/Room');


router.post('/rooms', async (req, res) => {
  try {
    const { nom, capacite, equipements, localisation, disponibilite } = req.body;
    const room = await Room.create({ nom, capacite, equipements, localisation, disponibilite });
    res.status(201).json({ room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Salle de réunion non trouvée' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/rooms/:id', async (req, res) => {
  try {
    const { nom, capacite, equipements, localisation, disponibilite } = req.body;
    const room = await Room.findByIdAndUpdate(req.params.id, { nom, capacite, equipements, localisation, disponibilite }, { new: true });
    if (!room) {
      return res.status(404).json({ message: 'Salle de réunion non trouvée' });
    }
    res.json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.delete('/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Salle de réunion non trouvée' });
    }
    res.json({ message: 'Salle de réunion supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/meeting-rooms', async (req, res) => {
  try {
  
    const meetingRooms = await Room.find({ disponibilite: true });


    res.json(meetingRooms);
  } catch (error) {

    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des salles de réunion disponibles' });
  }
});

module.exports = router;
