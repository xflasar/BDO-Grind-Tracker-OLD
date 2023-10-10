const mongoose = require('mongoose')

const loadoutSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  name: String,
  class: String,
  AP: Number,
  DP: Number
})

const Loadout = mongoose.model('Loadouts', loadoutSchema, 'Loadouts')

module.exports = Loadout
