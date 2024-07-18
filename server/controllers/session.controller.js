const User = require('../db/models/user.model')
const Session = require('../db/models/session.model')
const Site = require('../db/models/site.model')
const Loadout = require('../db/models/loadouts.model')
const UserControllerHelper = require('../helpers/user_controller.helper')

// GET
exports.GetSessionsData = async (req, res) => {
  try {
    const query = {
      UserId: req.userId
    }

    if (req.query.filteringValue) {
      query.SiteId = req.query.filteringValue
    }

    if (!req.query.paginationCurrentPage) {
      req.query.paginationCurrentPage = 0
    } else if (req.query.paginationCurrentPage > 0) {
      req.query.paginationCurrentPage -= 1
    }

    if (isNaN(req.query.paginationMaxElements)) {
      req.query.paginationMaxElements = Number(req.query.paginationMaxElements)
    }

    if (!req.query.paginationMaxElements) {
      req.query.paginationMaxElements = 10
    }

    if (req.query.lastId) {
      query.lastId = req.query.lastId
    }

    const skipItems = req.query.paginationCurrentPage * Number(req.query.paginationMaxElements)

    const sessions = await Session.find(query).skip(skipItems).limit(req.query.paginationMaxElements).populate('SiteId').populate('Loadout')

    if (!sessions || sessions.length === 0) {
      return res.status(200).send({ message: 'No sessions found!' })
    }

    const data = sessions.map((session) => ({
      _id: session._id,
      Date: UserControllerHelper.FormatSessionDate(session.creationDate),
      SiteId: session.SiteId._id,
      SiteName: session.SiteId.SiteName,
      sessionTime: session.sessionTime,
      Agris: session.Agris,
      AgrisTotal: session.AgrisTotal,
      totalSilverAfterTaxes: session.totalSilverAfterTaxes,
      silverPerHourBeforeTaxes: session.silverPerHourBeforeTaxes,
      silverPerHourAfterTaxes: session.silverPerHourAfterTaxes,
      tax: session.tax,
      SettingsDropRate: session.SettingsDropRate,
      DropItems: session.DropItems,
      Loadout: session.Loadout
    }))

    const totalPages = Math.ceil(await Session.countDocuments(query) / req.query.paginationMaxElements)

    res.status(200).send({ data, pages: totalPages })
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: err.message })
  }
}

// SET
exports.DeleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.body.SessionId)

    if (!session) {
      console.log('User Controller: Failed to find session to delete!')
      return res.status(500).send({ message: 'Session not found!' })
    }

    const user = await User.findById(session.UserId)
    const site = await Site.findById(session.SiteId)

    if (site) site.SiteData.filter((sessionData) => sessionData._id !== session._id)

    site.save()

    /*
    const siteUpdate = await UserControllerHelper.GetWeightedAverage(Session, session.SiteId, null, 'Site', session._id) */
    const userUpdate = await UserControllerHelper.GetWeightedAverage(Session, null, session.UserId, 'User', session._id)

    const defaultUpdate = {
      TotalTime: 0,
      TotalEarned: 0,
      // TotalExpenses: 0,
      AverageEarnings: 0,
      weightedAverage: 0
    }

    if (userUpdate.length === 0 || userUpdate[0].TotalEntries === 0) {
      userUpdate.push(defaultUpdate)
    }
    /*
    if (siteUpdate.length === 0 || siteUpdate[0].TotalEntries === 0) {
      siteUpdate.push(defaultUpdate)
    } */

    if (user) {
      user.Sessions = user.Sessions.filter(sessionId => sessionId.toString() !== session._id.toString())
      user.TotalTime = userUpdate[0].TotalTime
      user.TotalEarned = userUpdate[0].TotalEarned
      // user.TotalExpenses = userUpdate[0].TotalExpenses
      user.AverageEarnings = userUpdate[0].weightedAverage

      await user.save()
    }

    /* if (site) {
      site.TotalTime = siteUpdate[0].TotalTime
      site.TotalEarned = siteUpdate[0].TotalEarned
      // site.TotalExpenses = siteUpdate[0].TotalExpenses
      site.AverageEarnings = siteUpdate[0].weightedAverage

      await site.save()
    } */

    await Session.findByIdAndDelete(req.body.SessionId)

    await UserControllerHelper.AddUserRecentActivity(User, req.userId, { activity: 'Session deleted!', date: new Date() })

    this.GetSessionsData(req, res)
  } catch (err) {
    console.log('User Controller:', err)
    res.status(500).send({ message: 'An error occured while deleting the session!' })
  }
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

// Remove this
exports.ZeroItemsBasePrice = async () => {
  await Items.updateMany({ basePrice: { $exists: false } }, { basePrice: 0 }).then((result) => { console.log('Edditing done: ' + result.modifiedCount) })
}

// #endregion

// #region Data Add
exports.AddSession = async (req, res) => {
  console.log('Testing Correct Data Submission!', req.body)

  const sessionDoc = new Session({
    UserId: req.userId,
    creationDate: new Date(),
    SiteId: req.body.Site,
    sessionTime: req.body.sessionTime,
    Agris: req.body.Agris,
    AgrisTotal: req.body.AgrisTotal,
    totalSilverAfterTaxes: req.body.totalSilverAfterTaxes,
    silverPerHourBeforeTaxes: req.body.silverPerHourBeforeTaxes,
    silverPerHourAfterTaxes: req.body.silverPerHourAfterTaxes,
    tax: req.body.tax,
    SettingsDropRate: {
      DropRate: req.body.SettingsDropRate.DropRate,
      EcologyDropRate: req.body.SettingsDropRate.EcologyDropRate,
      NodeLevel: req.body.SettingsDropRate.NodeLevel,
      DropRateTotal: req.body.SettingsDropRate.DropRateTotal
    },
    DropItems: req.body.DropItems,
    Loadout: req.body.Loadout
  })

  try {
    sessionDoc.save().then((doc) => {
      User.findById(req.userId).then(async (user) => {
        if (!user) {
          sessionDoc.deleteOne().then(() => {
            console.log('Session deleted!')
          })
          return res.status(500).send({ message: 'User not found!' })
        }

        if (!user.Sites.find((site) => site.id === doc.SiteId)) {
          user.Sites.push(doc.SiteId)
        }

        const userSavedStatus = await UserControllerHelper.UpdateUserAfterSessionSaved(user, doc, Session)

        if (userSavedStatus) {
          Site.findById(doc.SiteId).then((site) => {
            site.SiteData.push(doc._id)
            site.save().then(async () => {
              console.log('Site Sites updated!')
              const loadout = {
                _id: req.body.Loadout,
                name: await Loadout.findById(req.body.Loadout).then((loadout) => loadout.name)
              }
              const data = {
                _id: doc._id,
                Date: UserControllerHelper.FormatSessionDate(doc.creationDate),
                SiteId: doc.SiteId,
                SiteName: site.SiteName,
                sessionTime: doc.sessionTime,
                Agris: doc.Agris,
                AgrisTotal: doc.AgrisTotal,
                totalSilverAfterTaxes: doc.totalSilverAfterTaxes,
                silverPerHourBeforeTaxes: doc.silverPerHourBeforeTaxes,
                silverPerHourAfterTaxes: doc.silverPerHourAfterTaxes,
                tax: doc.tax,
                SettingsDropRate: doc.SettingsDropRate,
                DropItems: doc.DropItems,
                Loadout: loadout
              }
              res.status(200).send(data)
            })
          })
        }
      })
      console.log('Inserted:', doc)
    })
  } catch (err) {
    console.log('Error:', err)
    sessionDoc.deleteOne().then(() => {
      console.log('Session deleted!')
    })
    return res.status(500).send(err)
  }
}

// Data Modify
exports.EditSession = async (req, res) => {
  try {
    const updateSessionData = {
      sessionTime: req.body.sessionTime,
      Agris: req.body.Agris,
      AgrisTotal: req.body.AgrisTotal,
      totalSilverAfterTaxes: req.body.totalSilverAfterTaxes,
      silverPerHourBeforeTaxes: req.body.silverPerHourBeforeTaxes,
      silverPerHourAfterTaxes: req.body.silverPerHourAfterTaxes,
      SettingsDropRate: {
        DropRate: req.body.SettingsDropRate.DropRate,
        EcologyDropRate: req.body.SettingsDropRate.EcologyDropRate,
        NodeLevel: req.body.SettingsDropRate.NodeLevel,
        DropRateTotal: req.body.SettingsDropRate.DropRateTotal
      },
      DropItems: req.body.DropItems,
      Loadout: req.body.Loadout
    }

    const SessionId = new ObjectId(req.body._id)

    // Used for purpose of restoring session of any edits
    const sessionBackup = await Session.findById(SessionId)

    const updatedSession = await Session.findOneAndUpdate(
      SessionId,
      { $set: { ...updateSessionData } },
      { new: true }
    )

    if (!updatedSession) {
      return res.status(500).send({ message: 'Error updating session!' })
    }

    const user = await User.findById(req.userId)

    if (!user) {
      // we need workaround for this so if in case we get error for this we can log this for futher processing ( we still have the total recalculation each day)
      return res.status(200)
      // return res.status(500).send({ message: 'User not found!' })
    }

    user.TotalTime += updateSessionData.sessionTime - req.body.originalSessionTime
    user.TotalEarned += updateSessionData.totalSilverAfterTaxes - req.body.originalTotalSilverAfterTaxes
    user.RecentActivity.push({ activity: 'Session edited!', date: new Date() })
    // user.TotalExpenses += req.body.originalSessionTime - updateSessionData.sessionTime
    await user.save().catch(async (err) => {
      console.error('Error updating user:', err)
      await Session.findByIdAndUpdate(sessionBackup._id,
        { $set: { ...sessionBackup } }, { new: true })
      res.status(500).send({ message: 'Error updating user!', err })
    })

    const loadout = await Loadout.findById(updatedSession.Loadout)
    res.status(200).send({
      _id: updatedSession._id,
      sessionTime: updatedSession.sessionTime,
      Agris: updatedSession.Agris,
      AgrisTotal: updatedSession.AgrisTotal,
      totalSilverAfterTaxes: updatedSession.totalSilverAfterTaxes,
      silverPerHourBeforeTaxes: updatedSession.silverPerHourBeforeTaxes,
      silverPerHourAfterTaxes: updatedSession.silverPerHourAfterTaxes,
      SettingsDropRate: updatedSession.SettingsDropRate,
      DropItems: updatedSession.DropItems,
      Loadout: loadout
    })
  } catch (err) {
    console.error('Error updating session:', err)
    res.status(500).send({ message: 'An error occured while updating the session.', err })
  }
}

// Not yet sure the impact of this - Ether I run it thru sessions finding UserId or thru Users and looping thru sessions saved in a field - currently It's looping thru User saved sessions in field
exports.GetSessionSites = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('Sessions')

    if (!user) return res.status(404).send({ message: 'User not found!' })

    const sessions = user.Sessions

    const siteIds = [...new Set(sessions.map(session => session.SiteId))]

    const sites = await Site.find({ _id: { $in: siteIds } }).select('SiteName')

    const siteMap = new Map(sites.map(site => [site._id.toString(), site.SiteName]))

    const uniqueSites = new Map()

    sessions.forEach(session => {
      const SiteId = session.SiteId;
      const SiteName = siteMap.get(SiteId.toString());
    
      if (SiteId && SiteName) {
        uniqueSites.set(SiteId.toString(), { SiteId, SiteName });
      }
    })

    const data = Array.from(uniqueSites.values())

    res.status(200).send(data)
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: err.message })
  }
}