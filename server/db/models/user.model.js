const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  DisplayName: String,
  FamilyName: String,
  TotalTime: Number,
  TotalEarnings: Number,
  Sites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sites',
  }],
  TotalExpenses: Number,
  authenticationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auths'
  },
  Sessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sessions',
  }],
  Settings: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSettings'
  }
});

const User = mongoose.model('Users', userSchema, "Users");

module.exports = User;