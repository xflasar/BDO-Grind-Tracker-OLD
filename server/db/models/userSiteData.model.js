const mongoose = require('mongoose')

const userSiteDataSchema = new mongoose.Schema({
  SiteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site'
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  TotalTime: Number,
  TotalEarned: Number,
  AverageEarnings: Number,
  TotalSpent: Number
})

const UserSiteData = mongoose.model('UserSiteData', userSiteDataSchema)

module.exports = UserSiteData
