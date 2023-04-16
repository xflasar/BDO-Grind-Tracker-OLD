const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  DisplayName: String,
  TotalTime: Number,
  TotalEarnings: Number,
  Sites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site'
  }],
  TotalExpenses: Number,
  authenticationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth'
  },
  Sessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;