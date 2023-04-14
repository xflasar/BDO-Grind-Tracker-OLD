const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
  SiteName: String,
  TotalTime: Number,
  TotalEarned: Number,
  TotalSpent: Number,
  AverageEarnings: Number,
  _id: mongoose.Schema.Types.ObjectId
});

const Site = mongoose.model('Site', siteSchema);

module.exports = Site;
