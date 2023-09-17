const { default: mongoose } = require("mongoose")

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

exports.GetWeightedAverage = async (dbSchema, id, type, excludeMatch = false) => {
  if (mongoose.Types.ObjectId.isValid(id)) id = new mongoose.Types.ObjectId(id)

  let match = {}
  if (type === 'User') {
    match = { UserId: id }
  } else if (type === 'Site') {
    match = { SiteId: id }
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
        TotalEarned: { $sum: '$Earnings' },
        TotalExpenses: { $sum: '$Expenses' },
        TotalTime: { $sum: '$TimeSpent' },
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
        sessionEarnings: '$sessions.Earnings',
        TotalEarned: '$TotalEarned',
        TotalExpenses: '$TotalExpenses',
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
        TotalExpenses: { $first: '$TotalExpenses' },
        TotalTime: { $first: '$TotalTime' },
        TotalEntries: { $first: '$TotalEntries' }
      }
    },
    {
      $project: {
        _id: 0,
        TotalEarned: 1,
        TotalExpenses: 1,
        TotalTime: 1,
        TotalEntries: 1,
        weightedAverage: 1
      }
    }
  ])
}
