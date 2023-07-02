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
  Gear: {
    TotalAP: Number,
    TotalDP: Number
  },
  TimeCreated: {
    type: Date,
    default: Date.now
  },
  UserId: mongoose.Schema.Types.ObjectId
})

const Session = mongoose.model('Sessions', sessionSchema, 'Sessions')

module.exports = Session
