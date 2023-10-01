const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  SiteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sites'
  },
  TimeSpent: Number,
  Earnings: Number,
  Expenses: Number,
  GearId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loadouts'
  },
  TimeCreated: {
    type: Date,
    default: Date.now
  }
})

const Session = mongoose.model('Sessions', sessionSchema, 'Sessions')

module.exports = Session
