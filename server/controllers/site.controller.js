const Site = require('../db/models/site.model')
const Items = require('../db/models/item.model')
const User = require('../db/models/user.model')

// GET
exports.GetAddSessionSitesItemData = async (req, res) => {
  Site.findById(req.params.siteId).populate('DropItems').then(async (site) => {
    if (!site) {
      return res.status(500).send({ message: 'No site found!' })
    } else {
      const DropItems = []
      for (const item of site.DropItems) {
        const tempItem = {
          itemId: item.itemId,
          itemName: item.itemName,
          validMarketplace: false
        }
        if (tempItem.itemId) {
          tempItem.itemPrice = await Items.findById(item.itemId).then((itemDB) => {
            if (itemDB.basePrice) {
              return itemDB.basePrice
            } else {
              return 0
            }
          })
          if (tempItem.itemPrice !== 0) tempItem.validMarketplace = true
        } else {
          tempItem.itemPrice = 0
        }

        if (tempItem.itemName.includes('&#39;')) tempItem.itemName = tempItem.itemName.replace('&#39;', "'")
        DropItems.push(tempItem)
      }

      res.status(200).send(DropItems)
    }
  })
}

exports.GetAddSessionSites = (req, res) => {
  Site.find({}, '_id SiteName').then((sites) => {
    if (!sites) {
      return res.status(500).send({ message: 'No sites found!' })
    }

    const dataSites = []

    sites.forEach((site) => {
      dataSites.push({ _id: site._id, SiteName: site.SiteName })
    })

    res.status(200).send(dataSites)
  })
}

exports.GetSiteData = async (req, res) => {
  try {
    const sites = await Site.find({ UserId: req.userId })

    if (!sites || sites.length === 0) return res.status(200).send({ message: 'No sites found!' })

    const data = sites.map((site) => ({
      SiteName: site.SiteName,
      TotalTime: site.TotalTime,
      TotalEarned: site.TotalEarned,
      TotalExpenses: site.TotalExpenses,
      AverageEarnings: site.AverageEarnings
    }))

    res.status(200).send(data)
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: err.message })
  }
}

// DEBUG
exports.AddSite = async (req, res, newSite = false) => {
  const site = new Site({
    SiteName: req.body.SiteName,
    TotalTime: req.body.TimeSpent,
    TotalEarned: req.body.TotalEarned,
    TotalExpenses: req.body.TotalExpenses,
    // AverageEarnings: req.body.AverageEarnings,
    UserId: req.userId
  })

  await site.save().catch(err => { res.status(500).send({ message: err }) })
  if (!newSite) {
    res.status(200).send({ message: 'Site added!' })
  } else {
    return site
  }
}

// Remove
exports.ModifySite = async (req, res) => {
  const updateObject = {
    TotalTime: req.body.TimeSpent,
    TotalEarned: req.body.TotalEarned,
    TotalExpenses: req.body.TotalExpenses,
    AverageEarnings: req.body.TotalEarned
  }

  const sumSiteDataDoc = await UserControllerHelper.GetWeightedAverage(Session, req.body.SiteId, null, 'Site')

  if (sumSiteDataDoc.length === 0) req.body.ModifySite = false

  if (req.body.ModifySite) {
    updateObject.TotalTime = sumSiteDataDoc[0].TotalTime
    updateObject.TotalEarned = sumSiteDataDoc[0].TotalEarned
    updateObject.TotalExpenses = sumSiteDataDoc[0].TotalExpenses
    updateObject.AverageEarnings = sumSiteDataDoc[0].weightedAverage

    await Site.findByIdAndUpdate(
      req.body.SiteId,
      { $set: { ...updateObject } },
      { new: true }
    )
  } else {
    await Site.findByIdAndUpdate(
      req.body.SiteId,
      { $set: { ...updateObject } },
      { new: true }
    )
  }
}