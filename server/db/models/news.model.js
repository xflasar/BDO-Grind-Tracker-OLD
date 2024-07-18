const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  newsUrl: String,
  newsIcon: String,
  date: Date,
  category: String,
  desc: String
})

newsSchema.index({ title: 1 })

const News = mongoose.model('News', newsSchema, 'News')

module.exports = News