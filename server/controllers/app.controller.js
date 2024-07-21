const SendEmail = require('../services/contactEmailsending.js')
const { emailConfig } = require('../config/emailSending.config.js')
const Session = require('../db/models/session.model.js')
const Sites = require('../db/models/site.model.js')
const News = require('../db/models/news.model.js')

exports.ContactSend = async (req, res) => {
  const { name, email, message } = req.body
  const messageToBeSent = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`

  // Use args1 -> email to be set to, args2 -> subject, args3 -> message
  SendEmail(emailConfig.user, 'Contact Us', messageToBeSent)
    .then(() => {
      res.status(200).send()
    }).catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while sending email'
      })
    })
}

exports.GetHompageGlobalData = async (req, res) => {
  const GlobalDataObj = {
    TotalTime: 0,
    TotalEarnings: 0,
    TotalSessions: 0,
    TopSite: 'None',
    TotalSessionsToday: 0
  }

  const sessionData = await Session.aggregate([
    {
      $group: {
        _id: null,
        TotalEarnings: { $sum: '$Earnings' },
        TotalTime: { $sum: '$TimeSpent' },
        TotalSessions: { $sum: 1 },
        TotalSessionsToday: { $sum: { $cond: { if: { $eq: ['$TimeCreated', new Date()] }, then: 1, else: 0 } } }
      }
    }
  ])

  if (!sessionData || sessionData.length === 0) return res.status(200).send(GlobalDataObj)

  GlobalDataObj.TotalEarnings = sessionData[0].TotalEarnings
  GlobalDataObj.TotalTime = sessionData[0].TotalTime
  GlobalDataObj.TotalSessions = sessionData[0].TotalSessions
  GlobalDataObj.TotalSessionsToday = sessionData[0].TotalSessionsToday

  const siteData = await Sites.aggregate([
    {
      $addFields: {
        calculatedValue: { $subtract: ['$TotalEarned', '$TotalExpenses'] }
      }
    },
    {
      $sort: { calculatedValue: -1 }
    },
    {
      $limit: 1
    },
    {
      $project: {
        _id: 0,
        SiteName: 1
      }
    }
  ])

  if (!siteData || siteData.length === 0) return res.status(200).send(GlobalDataObj)

  GlobalDataObj.TopSite = siteData[0].SiteName

  res.status(200).send(GlobalDataObj)
}

exports.GetNews = async (req, res) => {
  const newsAmount = 15
  try {
    const newsDataRes = await News.find().sort({date: -1}).limit(newsAmount)
    
    const newsData = newsDataRes.map(news => ({
      title: news.title,
      newsUrl: news.newsUrl,
      newsIcon: news.newsIcon,
      date: news.date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric'}),
      category: news.category,
      desc: news.desc
    }))

    return res.status(200).send(newsData);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}
