const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  creationDate: Date,
  SiteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sites'
  },
  sessionTime: Number,
  Agris: Number,
  AgrisTotal: Number,
  totalSilverAfterTaxes: Number,
  silverPerHourBeforeTaxes: Number,
  silverPerHourAfterTaxes: Number,
  tax: Number,

  SettingsDropRate: {
    DropRate: Object,
    EcologyDropRate: Number,
    NodeLevel: Number,
    DropRateTotal: Number
  },

  DropItems: Array,

  Loadout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loadouts'
  }
})

const Session = mongoose.model('Sessions', sessionSchema, 'Sessions')

module.exports = Session
