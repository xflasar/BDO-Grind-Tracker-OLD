const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  UserId: mongoose.Schema.Types.ObjectId
})

const Auth = mongoose.model('Auths', authSchema, 'Auths')

module.exports = Auth
