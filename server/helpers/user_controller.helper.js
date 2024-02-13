const { default: mongoose } = require('mongoose')

exports.TaxCalculation = (data) => {
  let taxCalculated = -0.35

  if (data.valuePack) taxCalculated = (taxCalculated + 0.195)

  if (data.merchantRing) taxCalculated = (taxCalculated + 0.0325)

  if (data.familyFame >= 1000 && data.familyFame < 4000) {
    taxCalculated = (taxCalculated + 0.0033)
  } else if (data.familyFame >= 4000 && data.familyFame < 7000) {
    taxCalculated = (taxCalculated + 0.0065)
  } else if (data.familyFame >= 7000) {
    taxCalculated = (taxCalculated + 0.0098)
  }

  return parseFloat(taxCalculated.toFixed(4))
}

exports.UserSettingsModify = async (data, initialData) => {
  for (const key in initialData._doc) {
    if (data[key] !== undefined && data[key] !== null && data[key] !== initialData[key]) {
      initialData[key] = data[key]
    }
  }
  await initialData.save({ new: true })
  return initialData
}

exports.GetWeightedAverage = async (dbSchema, siteId = null, userId = null, type, excludeMatch = false) => {
  if (mongoose.Types.ObjectId.isValid(siteId)) siteId = new mongoose.Types.ObjectId(siteId)
  if (mongoose.Types.ObjectId.isValid(userId)) userId = new mongoose.Types.ObjectId(userId)

  let match = {}
  if (type === 'User') {
    match = { UserId: userId }
  } else if (type === 'Site') {
    match = { SiteId: siteId }
  } else if (type === 'SessionCreation') {
    match = { UserId: userId, SiteId: siteId }
  } else {
    match = { _id: { $exists: true } }
  }

  if (excludeMatch) match = { ...match, _id: { $ne: excludeMatch } }

  return await dbSchema.aggregate([
    {
      $match: match
    },
    {
      $group: {
        _id: null,
        TotalEarned: { $sum: '$totalSilverAfterTaxes' },
        // TotalExpenses: { $sum: '$Expenses' },
        TotalTime: { $sum: '$sessionTime' },
        TotalEntries: { $sum: 1 },
        sessions: { $push: '$$ROOT' }
      }
    },
    {
      $unwind: '$sessions'
    },
    {
      $project: {
        _id: '$sessions._id',
        sessionEarnings: '$sessions.totalSilverAfterTaxes',
        TotalEarned: '$TotalEarned',
        // TotalExpenses: '$TotalExpenses',
        TotalTime: '$TotalTime',
        TotalEntries: '$TotalEntries'
      }
    },
    {
      $addFields: {
        contribution: { $divide: ['$sessionEarnings', '$TotalEarned'] }
      }
    },
    {
      $group: {
        _id: null,
        weightedAverage: { $sum: { $multiply: ['$sessionEarnings', '$contribution'] } },
        TotalEarned: { $first: '$TotalEarned' },
        // TotalExpenses: { $first: '$TotalExpenses' },
        TotalTime: { $first: '$TotalTime' },
        TotalEntries: { $first: '$TotalEntries' }
      }
    },
    {
      $project: {
        _id: 0,
        TotalEarned: 1,
        // TotalExpenses: 1,
        TotalTime: 1,
        TotalEntries: 1,
        weightedAverage: 1
      }
    }
  ])
}

exports.AddUserRecentActivity = async (dbSchema, userId, data) => {
  const doc = await dbSchema.findOne({ UserId: userId })
  if (doc) {
    if (doc.RecentActivity.length >= 10) doc.RecentActivity.shift()
    doc.RecentActivity.push(data)
    await doc.save()
  }
}

exports.FormatSessionDate = (date) => {
  const formattedDate = new Date(date)
  return `${formattedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} ${formattedDate.toLocaleDateString('en-US')}`
}

// #region AddSession helper functions
exports.CreateSession = async (Session, siteId, sessionData, userId) => {
  const sessionToAdd = new Session({
    SiteId: siteId,
    TimeSpent: sessionData.TimeSpent,
    Earnings: sessionData.TotalEarned,
    Expenses: sessionData.TotalExpenses,
    Gear: { TotalAP: sessionData.AP, TotalDP: sessionData.DP },
    TimeCreated: Date.now(),
    UserId: userId
  })

  return await sessionToAdd.save()
}

/*
  Input:
  - user -> found user document
  - savedSession -> saved session document
  - Session -> Session model
*/
exports.UpdateUserAfterSessionSaved = async (user, savedSession, Session) => {
  user.Sessions.push(savedSession._id)
  user.TotalEarned += savedSession.totalSilverAfterTaxes
  // user.TotalExpenses += savedSession.Expenses
  user.TotalTime += savedSession.sessionTime
  const data = await this.GetWeightedAverage(Session, savedSession.SiteId, user._id, 'SessionCreation')
  user.AverageEarnings = data[0].weightedAverage
  user.RecentActivity.push({ activity: 'Added new session.', date: new Date() })

  return await user.save()
}

exports.SessionAddFormatedResponse = (session, site) => {
  return {
    _id: session._id,
    Date: `${session.TimeCreated.getDate()}/${session.TimeCreated.getMonth() + 1}/${session.TimeCreated.getFullYear()}`,
    SiteName: site.SiteName,
    TimeSpent: session.TimeSpent,
    Earnings: session.Earnings,
    Expenses: session.Expenses,
    Gear: { TotalAP: session.Gear.TotalAP, TotalDP: session.Gear.TotalDP }
  }
}

// #endregion
