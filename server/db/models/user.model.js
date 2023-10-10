const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  DisplayName: String,
  FamilyName: String,
  ImageUrl: String,
  TotalTime: Number,
  TotalEarned: Number,
  TotalExpenses: Number,
  AverageEarnings: Number,
  SiteData: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSiteData'
  }],
  authenticationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auths'
  },
  Sessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sessions'
  }],
  Settings: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSettings'
  },
  RecentActivity: [{
    activity: String,
    date: Date
  }],
  UserLoadouts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loadouts'
  }]
})

const User = mongoose.model('Users', userSchema, 'Users')

module.exports = User
