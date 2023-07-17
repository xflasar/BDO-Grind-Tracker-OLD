const mongoose = require('mongoose')
const GrindItems = require('./grindItems.model')

const siteSchema = new mongoose.Schema({
  SiteName: String,
  Location: String,
  RecommendedLevel: Number,
  RecommendedAP: Number,
  RecommendedDP: Number,
  AverageGlobalSilverEarnings: Number,
  DroppedItems: [GrindItems]
})

const Site = mongoose.model('Sites', siteSchema, 'Sites')

module.exports = Site
