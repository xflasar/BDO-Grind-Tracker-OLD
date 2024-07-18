const News = require('../db/models/news.model')

exports.ProcessNews = async (newsData) => {
  if (!newsData) return false

  try {
    const bulkOps = newsData.map(news => ({
      updateOne: {
        filter: { title: news.title },
        update: {
          $setOnInsert: {
            newsUrl: news.newsUrl,
            newsIcon: news.newsIcon,
            date: news.date,
            category: news.category,
            desc: news.desc
          }
        },
        upsert: true
      }
    }))

    const result = await News.bulkWrite(bulkOps)

    console.log(`Inserted: ${result.insertedCount}, Matched: ${result.matchedCount}, Modfied: ${result.modifiedCount}, Upserted: ${result.upsertedCount}, UpsertedIds: ${result.upsertedIds}... END`)
    return true
  } catch (err) {
    console.log(`ProcessNews: ${err}`)
    return false
  }
}