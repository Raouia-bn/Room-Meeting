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

        await Reservation.findByIdAndUpdate(reservationId, updatedReservation);

        const userEmail = req.userEmail; 
        await sendReservationModificationEmail(userEmail, reservation);

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

        await Reservation.findByIdAndDelete(reservationId);

        const userEmail = req.userEmail; 
        await sendReservationCancellationEmail(userEmail, reservation);

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
        await sendReservationConfirmationEmail(userEmail, reservation);
        
        res.status(201).json({ message: 'Réservation effectuée avec succès', reservation });
    } catch (error) {
        console.error("Erreur lors de la réservation de la salle de réunion :", error); 
        res.status(500).json({ message: 'Erreur lors de la réservation de la salle de réunion' });
    }
});


module.exports = router;
