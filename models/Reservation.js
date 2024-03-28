const mongoose = require('mongoose');
function heureDebutEntre8hEt16h(heureDebut) {
  const heure = parseInt(heureDebut.split(':')[0]);
  return heure >= 8 && heure < 16;
}

function heureFinEntre9hEt17h(heureFin) {
  const heure = parseInt(heureFin.split(':')[0]);
  return heure >= 9 && heure < 17;
}
const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' }, 
  date: { type: Date, required: true }, 
  heureDebut: { 
    type: String, 
    required: true, 
    validate: [{ validator: heureDebutEntre8hEt16h, message: 'L\'heure de début doit être entre 8:00 et 16:00' }] 
  },
  heureFin: { 
    type: String, 
    required: true, 
    validate: [{ validator: heureFinEntre9hEt17h, message: 'L\'heure de fin doit être entre 9:00 et 17:00' }] 
  }
, 
  description: { type: String }, 
  statut: { type: String, enum: ['en_attente', 'confirmee', 'annulee'], default: 'en_attente' } 
});

module.exports = mongoose.model('Reservation', reservationSchema);
