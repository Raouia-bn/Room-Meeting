const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  capacite: { type: Number, required: true },
  equipements: { type: [String], default: [] },
  localisation: { type: String, required: true }, 
  disponibilite: { type: Boolean, default: true },
  image: { type: String } 
});

module.exports = mongoose.model('Room', RoomSchema);
