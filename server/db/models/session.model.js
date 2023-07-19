const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
  SiteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sites'
  },
  TimeSpent: Number,
  Earnings: Number,
  AverageEarnings: Number,
  Expenses: Number,
  Gear: mongoose.Schema.Types.ObjectId,
  TimeCreated: {
    type: Date,
    default: Date.now
  }
})

const Session = mongoose.model('Sessions', sessionSchema, 'Sessions')

module.exports = Session
