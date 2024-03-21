
const express = require('express');
const router = express.Router();
const MeetingRoom = require('../models/Room');


router.get('/meeting-rooms', async (req, res) => {
  try {
  
    const meetingRooms = await MeetingRoom.find({ disponibilite: true });


    res.json(meetingRooms);
  } catch (error) {

    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des salles de réunion disponibles' });
  }
});

module.exports = router;
