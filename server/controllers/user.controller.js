const bcrypt = require('bcryptjs')
const User = require('../db/models/user.model.js')
const Session = require('../db/models/session.model.js')
const Site = require('../db/models/site.model.js')
const Auth = require('../db/models/auth.model.js')
/* const UserSettings = require('../db/models/settings.model.js') */
const FreeImage = require('../services/freeImage.js')
const validator = require('../validators/user.validator.js')

// Sets
exports.SetUserProfileData = (req, res) => {
  const profileData = {}

  for (const key in req.body) {
    if (Object.prototype.hasOwnProperty.call(User.schema.obj, key)) {
      profileData[key] = req.body[key]
    }
  }

  profileData.RecentActivity.add({
    activity: 'Profile  data updated!',
    date: new Date()
  })

  User.findByIdAndUpdate(req.userId,
    { $set: { ...profileData } },
    { new: true }
  ).then(res.status(200).send({ message: 'User Profile Data updated!' })).catch(async (err) => {
    console.log(err)
    return await res.status(500).send({ message: 'Data not saved: ' + err })
  })
}

exports.SetUserSecurityData = async (req, res) => {
  await Auth.findOne({ UserId: req.userId }).then(async (auth) => {
    if (await bcrypt.compareSync(await req.body.userPassword, auth.password)) {
      auth.password = await bcrypt.hash(req.body.userNewPassword, 8)
      auth.save()
      User.findById(req.userId).then((user) => {
        if (!user) return

        user.RecentActivity.push({
          activity: 'Password changed!',
          date: new Date()
        })
        user.save()
      })
      return res.status(200).send({ message: 'Confirmed!' })
    } else {
      return res.status(401).send({ message: 'Wrong Password!' })
    }
  }).catch((err) => { res.status(500).send({ message: 'Errored: ' + err }) })
}

exports.SetUserSettingsData = async (req, res) => {
  /* UserSettings.findOne({ userId: req.userId }).then((settings) => {
    let taxCalculated = 0
    if (req.body.valuePack && req.body.merchantRing) {
      taxCalculated = (-0.35 + 0.2275).toFixed(4)
    } else if (req.body.valuePack) {
      taxCalculated = (-0.35 + 0.195).toFixed(4)
    } else if (req.body.merchantRing) {
      taxCalculated = (-0.35 + 0.0325).toFixed(4)
    }

    if (!settings) {
      const userSettings = new UserSettings({
        userId: req.userId,
        region: req.body.regionServer,
        valuePack: req.body.valuePack,
        merchantRing: req.body.merchantRing,
        familyFame: req.body.familyFame,
        tax: taxCalculated
      })
      userSettings.save().then((userSettingsSaved) => {
        User.findById(req.userId).then((user) => {
          user.Settings = userSettingsSaved._id
          user.save().catch((err) => { return res.status(500).send({ message: 'Failed to save User with newly updated UserSettings!' + err }) })
        }).catch((err) => { return res.status(500).send({ message: 'Failed to update User with newly created UserSettings!' + err }) })
        return res.status(200).send({ message: 'UserSettings created successfully!' })
      }).catch((err) => { return res.status(500).send({ message: 'Error creating usersettings ' + err }) })
    } else {
      settings.region = req.body.regionServer
      settings.valuePack = req.body.valuePack
      settings.merchantRing = req.body.merchantRing
      settings.familyFame = req.body.familyFame
      settings.tax = taxCalculated

      // Temporary object
      const dataBack = {
        RegionServer: settings.region,
        ValuePack: settings.valuePack,
        MerchantRing: settings.merchantRing,
        FamilyFame: settings.familyFame,
        Tax: settings.tax
      }

      settings.save().then(() => {
        res.status(200).send(dataBack)
        User.findById(req.userId).then((user) => {

      }).catch((err) => { return res.status(500).send({ message: 'Error updating usersettings! ' + err }) })
    }
  }).catch((err) => { return res.status(500).send({ message: 'Error finding usersettings! ' + err }) }) */
}

exports.UploadProfilePicture = async (req, res) => {
  if (!req.body.image64base) return
  const imgUploadResponse = await FreeImage.UploadImage(req.body.image64base)
  if (imgUploadResponse.success) {
    User.findById(req.userId).then(user => {
      if (!user) {
        return res.status(500).send({ message: 'User not found' })
      }
      user.ImageUrl = imgUploadResponse.image.url
      user.save().catch((err) => { throw err })
    }).catch((err) => { res.status(500).send({ message: err.message }) })
    res.sendStatus(200)
  }
}

// Gets
exports.GetUserProfileData = (req, res) => {
  User.findById(req.userId, 'DisplayName FamilyName').populate('authenticationId', 'username').then(async (user) => {
    if (!user) {
      return await res.status(500).send({ message: 'User not found!' })
    }

    const data = {
      DisplayName: user.DisplayName,
      Username: user.authenticationId.username,
      FamilyName: user.FamilyName
    }
    res.status(200).send(data)
  })
}

exports.GetUserSettingsData = (req, res) => {
  User.findById(req.userId, 'Settings').populate('Settings').then(async (user) => {
    if (!user) {
      return await res.status(500).send({ message: 'User not found!' })
    }

    const data = {
      RegionServer: user.Settings.region,
      ValuePack: user.Settings.valuePack,
      MerchantRing: user.Settings.merchantRing,
      FamilyFame: user.Settings.familyFame,
      Tax: user.Settings.tax
    }
    res.status(200).send(data)
  }).catch((err) => res.status(500).send({ message: err }))
}

exports.GetRecentActivity = (req, res) => {
  User.findById(req.userId, 'RecentActivity').populate('RecentActivity').then(async (user) => {
    if (!user) {
      return await res.status(500).send({ message: 'User not found!' })
    }

    const data = {
      RecentActivity: user.RecentActivity
    }
    res.status(200).send(data)
  }).catch((err) => res.status(500).send({ message: err }))
}

// Data Add
exports.AddSession = async (req, res) => {
  const validation = validator.AddSessionValidator(req.body)
  if (!validation.result) {
    return res.status(500).send(validation.errors)
  }

  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(500).send({ message: 'User not found!' })

    let site = await Site.findOne({ SiteName: req.body.SiteName, UserId: req.userId })
    // Pre-update for add Session feature
    // if(!site) return res.status(500).send({ message: 'Site not found!' })

    if (!site) {
      req.body.TotalTime = req.body.TotalExpenses
      site = await this.AddSite(req, res, true)
      user.Sites.push([site._id])
    } else {
      site.TotalTime = req.body.TimeSpent
      site.TotalEarned = req.body.TotalEarned
      site.TotalExpenses = req.body.TotalExpenses
      site.AverageEarnings = req.body.AverageEarnings
      await site.save().catch((error) => res.status(500).send({ message: error }))
    }

    const sessionToAdd = new Session({
      SiteId: site._id,
      TimeSpent: req.body.TimeSpent,
      Earnings: req.body.TotalEarned,
      AverageEarnings: req.body.AverageEarnings,
      Expenses: req.body.TotalExpenses,
      Gear: { TotalAP: req.body.AP, TotalDP: req.body.DP },
      TimeCreated: Date.now(),
      UserId: req.userId
    })

    const savedSession = await sessionToAdd.save()
    if (!savedSession) {
      req.body.TotalTime *= -1
      req.body.TotalEarned *= -1
      req.body.TotalExpenses *= -1
      req.body.AverageEarnings *= -1
      this.ModifySite(req, res)
      return res.status(500).send({ message: 'Session not saved!' })
    }

    user.Sessions.push(savedSession._id)
    user.TotalEarned += savedSession.Earnings
    user.TotalExpenses += savedSession.Expenses
    user.TotalTime += savedSession.TimeSpent
    user.AverageEarnings += savedSession.AverageEarnings
    user.RecentActivity.push({ activity: 'Added new session.', date: new Date() })
    await user.save().catch((error) => {
      Session.findOneAndDelete(savedSession.id)
      req.body.TotalTime *= -1
      req.body.TotalEarned *= -1
      req.body.TotalExpenses *= -1
      req.body.AverageEarnings *= -1
      this.ModifySite(req, res)
      res.status(500).send({ message: error })
      return res.status(500).send({ message: 'User not saved!' })
    })

    // Here should be the site update later
    res.status(200).send({
      _id: savedSession._id,
      Date: `${savedSession.TimeCreated.getDate()}/${savedSession.TimeCreated.getMonth() + 1}/${savedSession.TimeCreated.getFullYear()}`,
      SiteName: site.SiteName,
      TimeSpent: savedSession.TimeSpent,
      Earnings: savedSession.Earnings,
      AverageEarnings: savedSession.AverageEarnings,
      Expenses: savedSession.Expenses,
      Gear: { TotalAP: savedSession.Gear.TotalAP, TotalDP: savedSession.Gear.TotalDP }
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({ message: error })
  }
  /* await User.findById(req.userId).then(async (user) => {
    await Site.findOne({ SiteName: req.body.SiteName }, { UserId: req.userId }).then(async site => {
      // This is temporary maybe
      const BodyObj = {
        TimeSpent: parseInt(req.body.TimeSpent),
        TotalEarned: parseInt(req.body.TotalEarned),
        AverageEarnings: parseInt(req.body.AverageEarnings),
        TotalExpenses: parseInt(req.body.TotalExpenses),
        AP: parseInt(req.body.AP),
        DP: parseInt(req.body.DP)
      }

      // Check of properties
      if (!BodyObj.TimeSpent || !BodyObj.TotalEarned || !BodyObj.AverageEarnings || !BodyObj.TotalExpenses || !BodyObj.AP || !BodyObj.DP) {
        return res.status(400).send({ message: 'Missing required properties in request body' })
      }

      // Site section
      if (!site) {
        req.body.TotalTime = BodyObj.TotalExpenses
        req.body.TotalExpenses = BodyObj.TotalExpenses
        site = await this.AddSite(req, res, true)
        user.Sites.push([site._id])
      } else {
        site.TotalTime = BodyObj.TimeSpent
        site.TotalEarned = BodyObj.TotalEarned
        site.TotalExpenses = BodyObj.TotalExpenses
        site.AverageEarnings = BodyObj.AverageEarnings
        site.save().catch((error) => res.status(500).send({ message: error }))
      }

      // Session section
      const session = new Session({
        SiteId: site._id,
        TimeSpent: BodyObj.TimeSpent,
        Earnings: BodyObj.TotalEarned,
        AverageEarnings: BodyObj.AverageEarnings,
        Expenses: BodyObj.TotalExpenses,
        Gear: { TotalAP: BodyObj.AP, TotalDP: BodyObj.DP },
        TimeCreated: Date.now(),
        UserId: req.userId
      })

      await session.save().then(async (savedSession) => {
        user.Sessions.push([savedSession._id])
        user.TotalEarned += savedSession.Earnings
        user.TotalExpenses += savedSession.Expenses
        user.TotalTime += savedSession.TimeSpent
        user.AverageEarnings += savedSession.AverageEarnings
        await user.save().then(async () => {
          await this.GetSessionsData(req, res)
        }).catch(err => {
          Session.deleteOne({ _id: savedSession._id })
          req.body.TotalTime *= -1
          req.body.TotalEarned *= -1
          req.body.TotalExpenses *= -1
          req.body.AverageEarnings *= -1
          this.ModifySite(req, res)
          res.status(500).send({ message: err })
        })
      }).catch(err => {
        req.body.TotalTime *= -1
        req.body.TotalEarned *= -1
        req.body.TotalExpenses *= -1
        req.body.AverageEarnings *= -1
        this.ModifySite(req, res)
        res.status(500).send({ message: err })
      })
    }).catch(err => { res.status(500).send({ message: err }) })
  }).catch(err => { res.status(500).send({ message: err }) }) */
}

exports.AddSite = async (req, res, newSite = false) => {
  const site = new Site({
    SiteName: req.body.SiteName,
    TotalTime: req.body.TotalTime,
    TotalEarned: req.body.TotalEarned,
    TotalExpenses: req.body.TotalExpenses,
    AverageEarnings: req.body.AverageEarnings,
    UserId: req.userId
  })

  await site.save().catch(err => { res.status(500).send({ message: err }) })
  if (!newSite) {
    res.status(200).send({ message: 'Site added!' })
  } else {
    return site
  }
}
// Data Modify
exports.ModifySession = async (req, res) => {
  try {
    const sessionToUpdate = await Session.findById(req.body.SessionId)

    if (!sessionToUpdate) {
      return res.status(404).send({ message: 'Session not found!' })
    }

    const udateSessionData = {
      TimeSpent: parseInt(req.body.TimeSpent),
      Earnings: parseInt(req.body.TotalEarned),
      AverageEarnings: parseInt(req.body.AverageEarnings),
      Expenses: parseInt(req.body.TotalExpenses),
      Gear: { TotalAP: parseInt(req.body.Gear.TotalAP), TotalDP: parseInt(req.body.Gear.TotalDP) }
    }

    const updatedSession = await Session.findByIdAndUpdate(
      req.body.SessionId,
      { $set: { ...udateSessionData } },
      { new: true }
    )

    req.body.SiteId = updatedSession.SiteId
    req.body.TotalTime = updatedSession.TimeSpent
    req.body.TotalEarned = updatedSession.Earnings
    req.body.TotalExpenses = updatedSession.Expenses
    req.body.AverageEarnings = updatedSession.AverageEarnings

    req.body.ModifySite = true
    await this.ModifySite(req, res)

    req.body.ModifyUser = true
    await this.ModifyUserData(req, res)

    // This can be yet changed with the updateSessionData
    res.status(200).send({ _id: updatedSession._id, Date: updatedSession.Date, TimeSpent: updatedSession.TimeSpent, Earnings: updatedSession.Earnings, Expenses: updatedSession.Expenses, Gear: updatedSession.Gear })
  } catch (err) {
    console.error('Error updating session:', err)
    res.status(500).send({ message: 'An error occured while updating the session.', err })
  }
}

exports.ModifySite = async (req, res) => {
  const updateObject = {}
  if (req.body.ModifySite) {
    const objectToBeUpdated = await Site.findById(req.body.SiteId)

    objectToBeUpdated.TotalTime += req.body.TotalTime
    objectToBeUpdated.TotalEarned += req.body.TotalEarned
    objectToBeUpdated.TotalExpenses += req.body.TotalExpenses
    objectToBeUpdated.AverageEarnings += req.body.AverageEarnings

    await Site.findByIdAndUpdate(
      req.body.SiteId,
      { $set: { ...updateObject } },
      { new: true }
    )
  } else {
    updateObject.TotalTime = req.body.TimeSpent
    updateObject.TotalEarned = req.body.TotalEarned
    updateObject.TotalExpenses = req.body.TotalExpenses
    updateObject.AverageEarnings = req.body.AverageEarnings

    await Site.findByIdAndUpdate(
      req.body.SiteId,
      { $set: { ...updateObject } },
      { new: true }
    )
    res.status(200).send({ message: 'Site modified!' })
  }
}

exports.ModifyUserData = async (req, res) => {
  const updateObject = {}
  if (req.body.ModifyUser) {
    updateObject.TotalTime = req.body.TimeSpent
    updateObject.TotalEarnings = req.body.Earnings
    updateObject.TotalExpenses = req.body.Expenses
    updateObject.AverageEarnings = req.body.AverageEarnings

    await User.findByIdAndUpdate(
      req.userId,
      { $set: { ...updateObject } },
      { new: true }
    )
  } else {
    updateObject.TotalTime = req.body.TotalTime
    updateObject.TotalEarnings = req.body.TotalEarned
    updateObject.TotalExpenses = req.body.TotalExpenses
    updateObject.AverageEarnings = req.body.AverageEarnings

    await User.findByIdAndUpdate(
      req.userId,
      { $set: { ...updateObject } },
      { new: true }
    )
    res.status(200).send({ message: 'UserData modified!' })
  }
}

// Data Delete
exports.DeleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.body.SessionId)

    if (!session) {
      console.log('User Controller: Failed to find session to delete!')
      return res.status(500).send({ message: 'Session not found!' })
    }

    const user = await User.findById(session.UserId)
    const site = await Site.findById(session.SiteId)

    if (user) {
      user.Sessions = user.Sessions.filter(sessionId => sessionId.toString() !== session._id.toString())
      user.TotalTime -= session.TimeSpent
      user.TotalEarned -= session.Earnings
      user.TotalExpenses -= session.Expenses
      user.AverageEarnings -= session.AverageEarnings

      await user.save()
    }

    if (site) {
      site.TotalTime -= session.TimeSpent
      site.TotalEarned -= session.Earnings
      site.TotalExpenses -= session.Expenses
      site.AverageEarnings -= session.AverageEarnings

      await site.save()
    }

    await Session.findByIdAndDelete(req.body.SessionId)

    res.status(200).send({ message: 'Session deleted!' })
    user.RecentActivity.push({ activity: 'Deleted an session', date: new Date() })
    user.save()
  } catch (err) {
    console.log('User Controller:', err)
    res.status(500).send({ message: 'An error occured while deleting the session!' })
  }
}

// This is a dangerous function, it will delete all user data, including sessions and sites and authentication data | This function will be called when the user deletes his account
exports.DeleteUserData = (req, res) => {
  Site.deleteMany({ UserId: req.userId }).then(() => {
    Session.deleteMany({ UserId: req.userId }).then(() => {
      User.findByIdAndDelete(req.userId).then(() => {
        Auth.findOneAndDelete({ UserId: req.userId }).then(() => {
          try {
            req.session = null
            res.session.destroy()
            res.status(200).send({ message: 'User data deleted!' })
          } catch (err) {
            res.status(500).send({ message: err })
          }
        }).catch(err => { res.status(500).send({ message: err }) })
      }).catch(err => { res.status(500).send({ message: err }) })
    }).catch(err => { res.status(500).send({ message: err }) })
  }).catch(err => { res.status(500).send({ message: err }) })
}

// Data Get routes
// Homepage data
exports.GetHomepageData = async (req, res) => {
  User.findById(req.userId).then(async (user) => {
    try {
      const HomepageDataObj = {
        TotalTime: user.TotalTime,
        TotalEarnings: user.TotalEarned,
        TotalExpenses: user.TotalExpenses,
        AverageEarnings: user.AverageEarnings,
        TopSite: ''
      }
      await Site.findOne({ UserId: req.userId }).sort('-TotalTime').then(async (sites) => {
        if (!sites) {
          HomepageDataObj.TopSite = 'No Site'
        } else {
          HomepageDataObj.TopSite = sites.SiteName
        }
      }).catch(err => { res.status(500).send({ message: err }) })
      res.status(200).send(HomepageDataObj)
    } catch (err) {
      console.log(err)
    }
  }).catch(err => { console.log(err); res.status(500).send({ message: err }) })
}

// Site data
exports.GetSiteData = async (req, res) => {
  Site.find({ UserId: req.userId }).then(async (sites) => {
    const data = []
    for (let i = 0; i < sites.length; i++) {
      data.push({
        SiteName: sites[i].SiteName,
        TotalTime: sites[i].TotalTime,
        TotalEarned: sites[i].TotalEarned,
        TotalExpenses: sites[i].TotalExpenses,
        AverageEarnings: sites[i].AverageEarnings
      })
    }
    res.status(200).send(data)
  }).catch(err => { res.status(500).send({ message: err }) })
}

// History data
exports.GetSessionsData = async (req, res) => {
  Session.find({ UserId: req.userId }).populate('SiteId', 'SiteName').then(async (sessions) => {
    const data = sessions.map(session => {
      const date = new Date(session.TimeCreated)
      return {
        _id: session._id,
        Date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
        SiteName: session.SiteId.SiteName,
        TimeSpent: session.TimeSpent,
        Earnings: session.Earnings,
        AverageEarnings: session.AverageEarnings,
        Expenses: session.Expenses,
        Gear: session.Gear
      }
    })
    res.status(200).send(data)
  }).catch(err => { res.status(500).send({ message: err }) })
}
