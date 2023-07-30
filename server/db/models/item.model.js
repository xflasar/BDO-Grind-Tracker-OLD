const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  id: {
    type: Number,
    index: true,
    require: true
  },
  name: String,
  grade: String,
  icon: String,
  validMarketplace: Boolean,
  currentStock: {
    type: Number,
    default: 0
  },
  totalTrades: {
    type: Number,
    default: 0
  },
  basePrice: {
    type: Number,
    default: 0
  }
})

const Items = mongoose.model('Items', itemSchema, 'Items')

module.exports = Items
