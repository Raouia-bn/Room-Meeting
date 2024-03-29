const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  capacite: { type: Number, required: true },
  description: { type: String } ,
  equipements: { type: [String], default: [] },
  localisation: { type: String, required: true }, 

  image: { type: String } 
});

module.exports = mongoose.model('Room', RoomSchema);
