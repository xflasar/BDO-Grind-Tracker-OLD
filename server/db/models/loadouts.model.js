const mongoose = require('mongoose')

const loadoutSchema = new mongoose.Schema({
  name: String,
  AP: Number,
  DP: Number
})

const Loadout = mongoose.model('Loadouts', loadoutSchema, 'Loadouts')

module.exports = Loadout
