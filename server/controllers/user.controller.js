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
    auth.save()

    // We can probably do this in an user_controller.helper.js
    const user = await User.findById(req.userId)
    if (!user) return

    user.RecentActivity.push({
      activity: 'Password changed!',
      date: new Date()
    })

    user.save()

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

      userSettingsNew.save().then((userSettingsSaved) => User.findById(req.userId).then((user) => {
        user.Settings = userSettingsSaved._id
        user.RecentActivity.push({
          activity: 'Settings changed!',
          date: new Date()
        })
        user.save().catch((err) => { throw err })
      }))

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

    const user = User.findById(req.userId)
    if (!user) return

    user.RecentActivity.push({
      activity: 'Settings changed!',
      date: new Date()
    })
    user.save()

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

    const user = User.findById(req.userId)
    if (!user) return

    user.RecentActivity.push({
      activity: 'Session edited!',
      date: new Date()
    })
    user.save()

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
    updateObject.RecentActivity.push({
      activity: 'User data edited!',
      date: new Date()
    })

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
