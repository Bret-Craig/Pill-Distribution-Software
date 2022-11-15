const mongoose = require('mongoose');

//still need to determine better structure
const medSchema = mongoose.Schema({
  username: String,
  medication: String,
  dosage: Number,
  day: String
});

const Medication = mongoose.model("med-info", medSchema);


module.exports = Medication;