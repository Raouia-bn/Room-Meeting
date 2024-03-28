const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const User = require('../models/User');

const requireAuth = require('../middleware/authMiddleware');
const { sendReservationConfirmationEmail, sendReservationModificationEmail, sendReservationCancellationEmail } = require('../utils/emailUtils');


router.get('/reservations', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const reservations = await Reservation.find({ user: userId });
        res.json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des réservations de l\'utilisateur' });
    }
});


router.put('/reservations/:id', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const reservationId = req.params.id;
        const updatedReservation = req.body;
        
        const reservation = await Reservation.findOne({ _id: reservationId, user: userId });
        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        const room = await Room.findById(reservation.room);
        if (!room) {
            return res.status(404).json({ message: 'Salle de réunion non trouvée' });
        }
       
        if (updatedReservation.heureDebut >= updatedReservation.heureFin) {
            return res.status(400).json({ message: 'L\'heure de fin doit être ultérieure à l\'heure de début' });
        }

        
        const currentDate = new Date();
        if (new Date(updatedReservation.date) < currentDate) {
            return res.status(400).json({ message: 'La date de réservation doit être supérieure ou égale à la date actuelle' });
        }else if(new Date(updatedReservation.date) == currentDate)
        { 
            const currentHour = currentDate.getHours();
            if (parseInt(updatedReservation.heureDebut) < currentHour) {
                return res.status(400).json({ message: 'L\'heure de début de la réservation doit être supérieure à l\'heure actuelle' });
            }}

      

        
        const existingReservation = await Reservation.findOne({
            _id: { $ne: reservationId }, 
            room: reservation.room,
            date: updatedReservation.date,
            $or: [
                { heureDebut: { $lt: updatedReservation.heureFin }, heureFin: { $gt: updatedReservation.heureDebut } },
                { heureDebut: { $eq: updatedReservation.heureDebut }, heureFin: { $eq: updatedReservation.heureFin } }
            ]
        });

        if (existingReservation) {
            return res.status(400).json({ message: 'La salle de réunion est déjà réservée pour cette plage horaire' });
        }

        await Reservation.findByIdAndUpdate(reservationId, updatedReservation);

        const user = await User.findById(userId); 
        const userEmail = user.email;
        await sendReservationModificationEmail(userEmail, reservation, room.nom);

        res.json({ message: 'Réservation mise à jour avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la réservation' });
    }
});


router.delete('/reservations/:id', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const reservationId = req.params.id;
       
        const reservation = await Reservation.findOne({ _id: reservationId, user: userId });
        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        const room = await Room.findById(reservation.room);
        if (!room) {
            return res.status(404).json({ message: 'Salle de réunion non trouvée' });
        }
        await Reservation.findByIdAndDelete(reservationId);
        const user = await User.findById(userId); 
        const userEmail = user.email;
        await sendReservationCancellationEmail(userEmail, reservation, room.nom);

        res.json({ message: 'Réservation annulée avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'annulation de la réservation' });
    }
});

router.post('/reservations', requireAuth, async (req, res) => {
    try {
        const { roomId, date, heureDebut, heureFin } = req.body;
        const userId = req.userId; 

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Salle de réunion non trouvée' });
        }
        if (heureDebut >= heureFin) {
            return res.status(400).json({ message: 'L\'heure de fin doit être ultérieure à l\'heure de début' });
          }
          const currentDate = new Date();
          if (new Date(date) < currentDate) {
            return res.status(400).json({ success: false, message: 'La date de réservation doit être supérieure ou égale à la date actuelle' });
          }else if (new Date(date) < currentDate)
          { if (parseInt(heureDebut) < currentHour) {
            return res.status(400).json({ success: false, message: 'L\'heure de début de la réservation doit être supérieure à l\'heure actuelle' });
          }}
      
         
         

        const existingReservation = await Reservation.findOne({
            room: roomId,
            date: date,
            
            $or: [
                { heureDebut: { $lt: heureFin }, heureFin: { $gt: heureDebut } },
                { heureDebut: { $eq: heureDebut }, heureFin: { $eq: heureFin } }
            ]
        });

        if (existingReservation) {
            return res.status(400).json({ message: 'La salle de réunion est déjà réservée pour cette plage horaire' });
        }

        const reservation = await Reservation.create({
            user: userId,
            room: roomId,
            date: date,
            heureDebut: heureDebut, 
            heureFin: heureFin
        });

        const user = await User.findById(userId); 
        const userEmail = user.email;
        await sendReservationConfirmationEmail(userEmail, reservation, room.nom);
        
        res.status(201).json({ message: 'Réservation effectuée avec succès', reservation });
    } catch (error) {
        console.error("Erreur lors de la réservation de la salle de réunion :", error); 
        res.status(500).json({ message: 'Erreur lors de la réservation de la salle de réunion' });
    }
});
router.get('/rooms/:roomId/reservations', async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const room = await Room.findById(roomId);
        const reservations = await Reservation.find({ room: roomId });
        res.render('Room/roomReservations', { room, reservations });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors du rendu de la page des réservations de la salle');
    }
  });
module.exports = router;
