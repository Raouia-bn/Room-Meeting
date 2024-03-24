const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' }, 
  date: { type: Date, required: true }, 
  heureDebut: { type: Date, required: true }, 
  heureFin: { type: Date, required: true }, 
  description: { type: String }, 
  statut: { type: String, enum: ['en_attente', 'confirmee', 'annulee'], default: 'en_attente' } 
});

module.exports = mongoose.model('Reservation', reservationSchema);

