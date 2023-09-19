const bcrypt = require('bcryptjs')
const User = require('../db/models/user.model.js')
const Session = require('../db/models/session.model.js')
const Site = require('../db/models/site.model.js')
const Auth = require('../db/models/auth.model.js')
/* const UserSettings = require('../db/models/settings.model.js') */
const FreeImage = require('../services/freeImage.js')
const validator = require('../validators/user.validator.js')
const UserControllerHelper = require('../helpers/user_controller.helper.js')
const UserSettings = require('../db/models/settings.model.js')
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
  try {
    const auth = await Auth.findOne({ UserId: req.userId })
    if (!auth) return res.status(500).send({ message: 'Auth not found!' })

    if (await !bcrypt.compareSync(await req.body.userPassword, auth.password)) return res.status(401).send({ message: 'Wrong Password!' })

    auth.password = await bcrypt.hash(req.body.userNewPassword, 8)
    await auth.save()

    await UserControllerHelper.AddUserRecentActivity(User, req.userId, { activity: 'Password changed!', date: new Date() })

    res.status(200).send({ message: 'Confirmed!' })
  } catch (error) {
    console.error(error.message)
    res.status(500).send({ message: error.message })
  }
}

exports.SetUserSettingsData = async (req, res) => {
  try {
    const userSettings = await UserSettings.findOne({ userId: req.userId })

    if (!userSettings) {
      const userSettingsNew = new UserSettings({
        userId: req.userId,
        region: req.body.regionServer,
        valuePack: req.body.valuePack,
        merchantRing: req.body.merchantRing,
        familyFame: req.body.familyFame,
        tax: UserControllerHelper.TaxCalculation({ valuePack: req.body.valuePack, merchantRing: req.body.merchantRing, familyFame: req.body.familyFame })
      })

      userSettingsNew.save().then((userSettingsSaved) => UserControllerHelper.AddUserRecentActivity(User, req.userId, { activity: 'Settings created!', date: new Date() })
      )

      res.status(500).send({ message: 'UserSettings not found! Creating new one!' })
    }

    const updateData = {
      region: req.body.regionServer,
      valuePack: req.body.valuePack,
      merchantRing: req.body.merchantRing,
      familyFame: req.body.familyFame,
      tax: UserControllerHelper.TaxCalculation({ valuePack: req.body.valuePack, merchantRing: req.body.merchantRing, familyFame: req.body.familyFame })
    }

    UserControllerHelper.UserSettingsModify(updateData, userSettings)

    UserControllerHelper.AddUserRecentActivity(User, req.userId, { activity: 'Settings changed!', date: new Date() })

    res.status(200).send(updateData)
  } catch (error) {
    console.error(error.message)
    res.status(500).send({ message: error.message })
  }
}

exports.UploadProfilePicture = async (req, res) => {
  if (!req.body.image64base) return
  const imgUploadResponse = await FreeImage.UploadImage(req.body.image64base)
  if (imgUploadResponse.success) {
    try {
      const user = await User.findById(req.userId)

      if (!user) return res.status(500).send({ message: 'User not found!' })

      user.ImageUrl = imgUploadResponse.image.url

      user.RecentActivity.push({
        activity: 'Uploaded profile picture!',
        date: new Date()
      })

      user.save().catch((err) => { throw err })
    } catch (error) {
      console.error(error.message)
      res.status(500).send({ message: error.message })
    }

    res.sendStatus(200)
  }
}

// Gets
exports.GetUserProfileData = async (req, res) => {
  try {
    const user = await User.findById(req.userId, 'DisplayName FamilyName').populate('authenticationId', 'username')

    if (!user) return res.status(500).send({ message: 'User not found!' })

    const data = {
      DisplayName: user.DisplayName,
      Username: user.authenticationId.username,
      FamilyName: user.FamilyName
    }

    res.status(200).send(data)
  } catch (error) {
    console.error(error.message)
    res.status(500).send({ message: error.message })
  }
}

exports.GetUserSettingsData = async (req, res) => {
  try {
    const user = await User.findById(req.userId, 'Settings').populate('Settings')

    if (!user) return res.status(500).send({ message: 'User not found!' })

    const data = {
      region: user.Settings.region,
      valuePack: user.Settings.valuePack,
      merchantRing: user.Settings.merchantRing,
      familyFame: user.Settings.familyFame,
      tax: user.Settings.tax
    }

    res.status(200).send(data)
  } catch (error) {
    console.error(error.message)
    res.status(500).send({ message: error.message })
  }
}

exports.GetRecentActivity = async (req, res) => {
  try {
    const user = await User.findById(req.userId, 'RecentActivity').populate('RecentActivity')

    if (!user) return res.status(500).send({ message: 'User not found!' })
    const userRecentActivity = user.RecentActivity.sort((a, b) => (a.date > b.date) ? -1 : ((b.date > a.date) ? 1 : 0)).map((activity) => {
      return {
        date: `${activity.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} ${activity.date.toLocaleDateString('en-US')}`,
        activity: activity.activity
      }
    })

    const data = {
      RecentActivity: userRecentActivity
    }
    res.status(200).send(data)
  } catch (error) {
    console.error(error.message)
    res.status(500).send({ message: error.message })
  }
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
      site = await this.AddSite(req, res, true)
      user.Sites.push([site._id])
    } else {
      req.body.ModifySite = true
      req.body.SiteId = site._id
      await this.ModifySite(req, res)
    }

    const sessionToAdd = await UserControllerHelper.CreateSession(Session, site.id, req.body, req.userId)

    if (!sessionToAdd) {
      req.body.ModifySite = true
      req.body.TotalTime *= -1
      req.body.TotalEarned *= -1
      req.body.TotalExpenses *= -1
      this.ModifySite(req, res)
      return res.status(500).send({ message: 'Session not saved!' })
    }

    await UserControllerHelper.UpdateUserAfterSessionSaved(user, sessionToAdd)

    // Here should be the site update later
    res.status(200).send(UserControllerHelper.SessionAddFormatedResponse(sessionToAdd, site))
  } catch (error) {
    console.error(error)
    res.status(500).send({ message: error })
  }
}

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

    req.body.ModifySite = true
    await this.ModifySite(req, res)

    req.body.ModifyUser = true
    await this.ModifyUserData(req, res)

    UserControllerHelper.AddUserRecentActivity(User, req.userId, { activity: 'Session edited!', date: new Date() })

    // This can be yet changed with the updateSessionData
    res.status(200).send({ _id: updatedSession._id, Date: updatedSession.Date, TimeSpent: updatedSession.TimeSpent, Earnings: updatedSession.Earnings, Expenses: updatedSession.Expenses, Gear: updatedSession.Gear })
  } catch (err) {
    console.error('Error updating session:', err)
    res.status(500).send({ message: 'An error occured while updating the session.', err })
  }
}

exports.ModifySite = async (req, res) => {
  const updateObject = {}
  const sumSiteDataDoc = await UserControllerHelper.GetWeightedAverage(Session, req.body.SiteId, 'Site')

  if (sumSiteDataDoc.length === 0) req.body.ModifySite = false

  if (req.body.ModifySite) {
    updateObject.TotalTime = sumSiteDataDoc[0].TotalTime
    updateObject.TotalEarned = sumSiteDataDoc[0].TotalEarned
    updateObject.TotalExpenses = sumSiteDataDoc[0].TotalExpenses
    updateObject.AverageEarnings = sumSiteDataDoc[0].weightedAverage // FIXME: [BDOGT-55] AverageEarnings is not being updated at same time

    await Site.findByIdAndUpdate(
      req.body.SiteId,
      { $set: { ...updateObject } },
      { new: true }
    )
  } else {
    updateObject.TotalTime = req.body.TimeSpent
    updateObject.TotalEarned = req.body.TotalEarned
    updateObject.TotalExpenses = req.body.TotalExpenses
    updateObject.AverageEarnings = req.body.TotalEarned

    await Site.findByIdAndUpdate(
      req.body.SiteId,
      { $set: { ...updateObject } },
      { new: true }
    )
  }
}

exports.ModifyUserData = async (req, res) => {
  const updateObject = {}
  const sumUserDataDoc = await UserControllerHelper.GetWeightedAverage(Session, req.userId, 'User')

  if (sumUserDataDoc.length === 0) req.body.ModifyUser = false

  if (req.body.ModifyUser) {
    updateObject.TotalTime = sumUserDataDoc[0].TotalTime
    updateObject.TotalEarned = sumUserDataDoc[0].TotalEarned
    updateObject.TotalExpenses = sumUserDataDoc[0].TotalExpenses
    updateObject.AverageEarnings = sumUserDataDoc[0].weightedAverage // FIXME: [BDOGT-55] AverageEarnings is not being updated at same time

    await User.findByIdAndUpdate(
      req.userId,
      { $set: { ...updateObject } },
      { new: true }
    )
  } else {
    updateObject.TotalTime = req.body.TotalTime
    updateObject.TotalEarnings = req.body.TotalEarned
    updateObject.TotalExpenses = req.body.TotalExpenses
    updateObject.AverageEarnings = req.body.TotalEarned

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
    const siteUpdate = await UserControllerHelper.GetWeightedAverage(Session, session.SiteId, 'Site', session._id)
    const userUpdate = await UserControllerHelper.GetWeightedAverage(Session, session.UserId, 'User', session._id)

    if (userUpdate.length === 0 || userUpdate[0].TotalEntries === 0) {
      userUpdate.push({
        TotalTime: 0,
        TotalEarned: 0,
        TotalExpenses: 0,
        AverageEarnings: 0,
        weightedAverage: 0
      })
    }

    if (siteUpdate.length === 0 || siteUpdate[0].TotalEntries === 0) {
      siteUpdate.push({
        TotalTime: 0,
        TotalEarned: 0,
        TotalExpenses: 0,
        AverageEarnings: 0,
        weightedAverage: 0
      })
    }

    if (user) {
      user.Sessions = user.Sessions.filter(sessionId => sessionId.toString() !== session._id.toString())
      user.TotalTime = userUpdate[0].TotalTime
      user.TotalEarned = userUpdate[0].TotalEarned
      user.TotalExpenses = userUpdate[0].TotalExpenses
      user.AverageEarnings = userUpdate[0].weightedAverage

      await user.save()
    }

    if (site) {
      site.TotalTime = siteUpdate[0].TotalTime
      site.TotalEarned = siteUpdate[0].TotalEarned
      site.TotalExpenses = siteUpdate[0].TotalExpenses
      site.AverageEarnings = siteUpdate[0].weightedAverage

      await site.save()
    }

    await Session.findByIdAndDelete(req.body.SessionId)

    UserControllerHelper.AddUserRecentActivity(User, req.userId, { activity: 'Session deleted!', date: new Date() })

    res.status(200).send({ message: 'Session deleted!' })
  } catch (err) {
    console.log('User Controller:', err)
    res.status(500).send({ message: 'An error occured while deleting the session!' })
  }
}

// This is a dangerous function, it will delete all user data, including sessions and sites and authentication data | This function will be called when the user deletes his account
exports.DeleteUserData = async (req, res) => {
  try {
    await Site.deleteMany({ UserId: req.userId })
    await Session.deleteMany({ UserId: req.userId })
    await User.findByIdAndDelete(req.userId)
    await Auth.findOneAndDelete({ UserId: req.userId })

    req.session = null
    res.session.destroy()

    res.status(200).send({ message: 'User data deleted!' })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

// Data Get routes
// Homepage data
exports.GetHomepageData = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).send({ message: 'User not found!' })

    const HomepageDataObj = {
      TotalTime: user.TotalTime,
      TotalEarnings: user.TotalEarned,
      TotalExpenses: user.TotalExpenses,
      AverageEarnings: user.AverageEarnings,
      TopSite: ''
    }

    const sites = await Site.findOne({ UserId: req.userId }).sort('-TotalTime')

    if (!sites) {
      HomepageDataObj.TopSite = 'No Site'
    } else {
      HomepageDataObj.TopSite = sites.SiteName
    }

    res.status(200).send(HomepageDataObj)
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: err.message })
  }
}

// Site data
exports.GetSiteData = async (req, res) => {
  try {
    const sites = await Site.find({ UserId: req.userId })

    if (!sites) return res.status(404).send({ message: 'Sites not found!' })

    const data = sites.map((site) => ({
      SiteName: site.SiteName,
      TotalTime: site.TotalTime,
      TotalEarned: site.TotalEarned,
      TotalExpenses: site.TotalExpenses,
      AverageEarnings: site.AverageEarnings
    }))

    res.status(200).send(data)
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: err.message })
  }
}

// History data
exports.GetSessionsData = async (req, res) => {
  try {
    const sessions = await Session.find({ UserId: req.userId }).populate('SiteId', 'SiteName')

    if (!sessions) return res.status(404).send({ message: 'Sessions not found!' })

    const data = sessions.map((session) => {
      const date = new Date(session.TimeCreated)
      return {
        _id: session._id,
        Date: `${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} ${date.toLocaleDateString('en-US')}`,
        SiteName: session.SiteId.SiteName,
        TimeSpent: session.TimeSpent,
        Earnings: session.Earnings,
        AverageEarnings: session.AverageEarnings,
        Expenses: session.Expenses,
        Gear: session.Gear
      }
    })

    res.status(200).send(data)
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: err.message })
  }
}
