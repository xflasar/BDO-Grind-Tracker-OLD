const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  DisplayName: String,
  FamilyName: String,
  ImageUrl: String,
  TotalTime: Number,
  TotalEarned: Number,
  TotalExpenses: Number,
  AverageEarnings: Number,
  Sites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sites'
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
    ref: 'Loadout'
  }]
})

const User = mongoose.model('Users', userSchema, 'Users')

module.exports = User
