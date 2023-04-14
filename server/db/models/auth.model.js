const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
});

const Auth = mongoose.model('Auth', authSchema);

module.exports = Auth;
