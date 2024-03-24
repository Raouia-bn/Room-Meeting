const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Reservation = require('../models/Reservation');
const Room = require('../models/Room'); // Import du modèle de la salle
const  requireAuth  = require('../middleware/authMiddleware');

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

        // Vérifier si la salle de réunion existe
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Salle de réunion non trouvée' });
        }

        // Vérifier s'il existe déjà une réservation pour cette salle et cette plage horaire
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

        // Créer une nouvelle réservation
        const reservation = await Reservation.create({
            user: userId,
            room: roomId,
            date: date,
            heureDebut: heureDebut,
            heureFin: heureFin
        });

        res.status(201).json({ message: 'Réservation effectuée avec succès', reservation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la réservation de la salle de réunion' });
    }
});


module.exports = router;
