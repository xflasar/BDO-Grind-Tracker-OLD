const cron = require('cron')
const { ProcessNews } = require('../helpers/news.helper')
const { Scrapped } = require('../services/BDO_news_scraper')
let cronJob = undefined

// Starts cron for news update every 12 hours '00 00 */12 * * *'
exports.Init = () => {
  cronJob = new cron.CronJob('00 00 */12 * * *', async () => {
    console.log('News data cron job run: ', new Date())
    const newsData = await Scrapped()
    const newsUpdateState = await ProcessNews(newsData)

    // Log to logger
    console.log(`News update completed ${newsUpdateState ? 'successfully': 'with errors'}. At ${new Date()}`)
  }, {
    timeZone: "Europe/Prague"
  })

  cronJob.start()

  console.log(`NewsCronJob started! => Status: ${cronJob.running ? 'running' : 'undefined'}`)
}

// Used for stopping cron job
exports.Stop = () => {
  cronJob.stop()

  console.log(`NewsCronJob Stopped!`)
  return true
}