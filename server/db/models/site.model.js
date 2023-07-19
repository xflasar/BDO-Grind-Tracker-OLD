const mongoose = require('mongoose')

const siteSchema = new mongoose.Schema({
  SiteName: String,
  Location: String,
  RecommendedLevel: Number,
  RecommendedAP: Number,
  RecommendedDP: Number,
  AverageGlobalSilverEarnings: Number,
  DroppedItems: [
    {
      itemName: String,
      amount: Number
    }
  ]
})

const Site = mongoose.model('Sites', siteSchema, 'Sites')

module.exports = Site
