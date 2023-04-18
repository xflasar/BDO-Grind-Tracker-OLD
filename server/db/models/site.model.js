const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
  SiteName: String,
  TotalTime: Number,
  TotalEarned: Number,
  TotalSpent: Number,
  AverageEarnings: Number,
  UserId: mongoose.Schema.Types.ObjectId
});

const Site = mongoose.model('Sites', siteSchema, "Sites");

module.exports = Site;
