const mongoose = require('mongoose')

const siteSchema = new mongoose.Schema({
  SiteName: String,
  Location: String,
  RecommendedAP: Number,
  RecommendedDP: Number,
  AverageGlobalSilverEarnings: Number,
  DroppedItems: [
    {
      itemName: String,
      amount: Number
    }
  ],
  SiteData: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSiteData'
  }]
})

const Site = mongoose.model('Sites', siteSchema, 'Sites')

module.exports = Site
