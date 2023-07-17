const mongoose = require('mongoose')

const grindItems = new mongoose.Schema({
  itemName: String,
  amount: Number
})

module.exports = grindItems
