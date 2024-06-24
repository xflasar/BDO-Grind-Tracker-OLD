const mongoose = require('mongoose')

const siteSchema = new mongoose.Schema({
  SiteName: String,
  Location: String,
  RecommendedAP: String,
  RecommendedDP: String,
  AverageGlobalSilverEarnings: Number,
  DropItems: [
    {
      itemId: mongoose.Schema.Types.ObjectId,
      itemName: String
    }
  ],
  SiteData: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSiteData',
    default: []
  }]
})

const Site = mongoose.model('Sites', siteSchema, 'Sites')

module.exports = Site
