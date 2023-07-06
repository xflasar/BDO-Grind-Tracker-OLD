const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  }
})

const Auth = mongoose.model('Auths', authSchema, 'Auths')

module.exports = Auth
