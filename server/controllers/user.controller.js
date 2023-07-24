const bcrypt = require('bcryptjs')
const User = require('../db/models/user.model.js')
const Session = require('../db/models/session.model.js')
const Site = require('../db/models/site.model.js')
const Auth = require('../db/models/auth.model.js')
const UserSettings = require('../db/models/settings.model.js')
const FreeImage = require('../services/freeImage.js')

// #region Sets
exports.SetUserProfileData = (req, res) => {
  const profileData = {}

  for (const key in req.body) {
    if (Object.prototype.hasOwnProperty.call(User.schema.obj, key)) {
      profileData[key] = req.body[key]
    }
  }

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
      return res.status(200).send({ message: 'Confirmed!' })
    } else {
      return res.status(401).send({ message: 'Wrong Password!' })
    }
  }).catch((err) => { res.status(500).send({ message: 'Errored: ' + err }) })
}

exports.SetUserSettingsData = async (req, res) => {
  UserSettings.findOne({ userId: req.userId }).then((settings) => {
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

      settings.save().then(() => res.status(200).send({ message: 'UserSettings updated successfully!' })).catch((err) => { return res.status(500).send({ message: 'Error updating usersettings! ' + err }) })
    }
  }).catch((err) => { return res.status(500).send({ message: 'Error finding usersettings! ' + err }) })
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
// #endregion

// #region Gets
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

exports.GetAddSessionSites = (req, res) => {
  Site.find('_id SiteName').then((sites) => {
    if (!sites) {
      return res.status(500).send({ message: 'No sites found!' })
    }
    res.status(200).send(sites)
  })
}

exports.GetAddSessionSitesItemData = (req, res) => {
  Site.findById(req.body.siteId).then((site) => {
    if (!site) {
      return res.status(500).send({ message: 'No site found!' })
    } else {
      res.status(200).send(site.DroppedItems)
    }
  })
}
// #endregion

// #region Data Add
exports.AddSession = async (req, res) => {
  await User.findById(req.userId).then(async (user) => {
    await Site.findOne({ SiteName: req.body.SiteName }, { UserId: req.userId }).then(async site => {
      if (!site) {
        return res.status(500).send({ message: 'Failed to find Site!' })
        /* req.body.TotalTime = BodyObj.TotalSpent
        site = await this.AddSite(req, res, true)
        user.Sites.push([site._id]) */
      } else {
        const BodyObj = {
          TimeSpent: parseInt(req.body.TimeSpent),
          TotalEarned: parseInt(req.body.TotalEarned),
          AverageEarnings: parseInt(req.body.AverageEarnings),
          TotalSpent: parseInt(req.body.TotalSpent),
          AP: parseInt(req.body.AP),
          DP: parseInt(req.body.DP)
        }

        if (!BodyObj.TimeSpent || !BodyObj.TotalEarned || !BodyObj.AverageEarnings ||   !BodyObj.TotalSpent || !BodyObj.AP || !BodyObj.DP) {
          return res.status(400).send({ message: 'Missing required properties in  request body' })
        }

        req.body.SiteId = site.id
        req.body.ModifySite = true
        req.body.TimeSpent = BodyObj.TimeSpent
        req.body.TotalEarned = BodyObj.TotalEarned
        req.body.TotalSpent = BodyObj.TotalSpent
        req.body.AverageEarnings = BodyObj.AverageEarnings
        await this.ModifySite(req, res)

        const session = new Session({
          SiteId: site._id,
          TimeSpent: BodyObj.TimeSpent,
          Earnings: BodyObj.TotalEarned,
          AverageEarnings: BodyObj.AverageEarnings,
          Expenses: BodyObj.TotalSpent,
          Gear: { TotalAP: BodyObj.AP, TotalDP: BodyObj.DP },
          TimeCreated: Date.now(),
          UserId: req.userId
        })

        await session.save().then(async (savedSession) => {
          user.Sessions.push([savedSession._id])
          await user.save().then(async () => {
            await this.GetSessionsData(req, res)
          }).catch(err => { res.status(500).send({ message: err }) })
        }).catch(err => { res.status(500).send({ message: err }) })
      }
    }).catch(err => { res.status(500).send({ message: err }) })
  }).catch(err => { res.status(500).send({ message: err }) })
}
// #endregion

// #region Data Modify
exports.ModifySession = async (req, res) => {
  const BodyObj = {
    SessionId: req.body._id,
    TimeSpent: parseInt(req.body.TimeSpent),
    Earnings: parseInt(req.body.TotalEarned),
    AverageEarnings: parseInt(req.body.AverageEarnings),
    Expenses: parseInt(req.body.TotalSpent),
    Gear: { TotalAP: parseInt(req.body.Gear.TotalAP), TotalDP: parseInt(req.body.Gear.TotalDP) }
  }

  // Find All the keys in the body object that are in the session schema
  const updateObject = {}
  for (const key in BodyObj) {
    if (Object.prototype.hasOwnProperty.call(BodyObj, key)) {
      updateObject[key] = BodyObj[key]
    }
  }

  // Update the session then update Site and UserData
  await Session.findByIdAndUpdate(
    req.body.SessionId,
    { $set: { ...updateObject } },
    { new: true }
  ).then(async (session) => {
    req.body.SiteId = session.SiteId
    req.body.TimeSpent = session.TimeSpent
    req.body.TotalEarned = session.Earnings
    req.body.TotalSpent = session.Expenses
    req.body.AverageEarnings = session.AverageEarnings
    req.body.ModifySite = true
    await this.ModifySite(req, res)
    req.body.ModifyUser = true
    await this.ModifyUserData(req, res)
    res.status(200).send({ message: 'Session modified!' })
  }).catch(err => { res.status(500).send({ message: err }) })
}

exports.ModifySite = async (req, res) => {
  const updateObject = {}
  if (req.body.ModifySite) {
    const objectToBeUpdated = await Site.findById(req.body.SiteId)
    updateObject.TotalTime = req.body.TimeSpent = objectToBeUpdated.TotalTime + req.body.TimeSpent
    updateObject.TotalEarned = req.body.TotalEarned = objectToBeUpdated.TotalEarned + req.body.TotalEarned
    updateObject.TotalSpent = req.body.TotalSpent = objectToBeUpdated.TotalSpent + req.body.TotalSpent
    updateObject.AverageEarnings = req.body.AverageEarnings = objectToBeUpdated.AverageEarnings + req.body.AverageEarnings

    await Site.findByIdAndUpdate(
      req.body.SiteId,
      { $set: { ...updateObject } },
      { new: true }
    )
  } else {
    updateObject.TotalTime = req.body.TimeSpent
    updateObject.TotalEarned = req.body.TotalEarned
    updateObject.TotalSpent = req.body.TotalSpent
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

    await User.findByIdAndUpdate(
      req.userId,
      { $set: { ...updateObject } },
      { new: true }
    )
  } else {
    updateObject.TotalTime = req.body.TotalTime
    updateObject.TotalEarnings = req.body.TotalEarned
    updateObject.TotalExpenses = req.body.TotalSpent

    await User.findByIdAndUpdate(
      req.userId,
      { $set: { ...updateObject } },
      { new: true }
    )
    res.status(200).send({ message: 'UserData modified!' })
  }
}
// #endregion

// #region Data Delete
exports.DeleteSession = (req, res) => {
  Session.findById(req.body.SessionId).then(async (session) => {
    if (session) {
      req.body.SiteId = session.SiteId
      req.body.TimeSpent = -session.TimeSpent
      req.body.TotalEarned = -session.Earnings
      req.body.TotalSpent = -session.Expenses
      req.body.AverageEarnings = -session.AverageEarnings
      req.body.ModifySite = true
      await this.ModifySite(req, res)
      req.body.ModifyUser = true
      await this.ModifyUserData(req, res)
      Session.findByIdAndDelete(req.body.SessionId).then(() => {
        res.status(200).send({ message: 'Session deleted!' })
      }).catch(err => { res.status(500).send({ message: err }) })
    } else {
      console.log('User Controller: \n' + req.body)
      console.log('User Controller: Failed to delete session!')
    }
  }).catch(err => { res.status(500).send({ message: err }) })
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
// #endregion

// #region Data Get routes
// Homepage data
exports.GetHomepageData = async (req, res) => {
  User.findById(req.userId).then(async (user) => {
    try {
      const data = {
        TotalTimeO: {

          Title: 'Total Time',
          Content: user.TotalTime
        },
        TotalEarningsO: {
          Title: 'Total Earnings',
          Content: user.TotalEarnings
        },
        TotalExpensesO: {
          Title: 'Total Expenses',
          Content: user.TotalExpenses
        },
        AverageEarningsO: {
          Title: 'Average Earnings',
          Content: 0
        },
        SiteO: {
          Title: 'Top Site',
          Content: ''
        }
      }
      await Site.findOne({ UserId: req.userId }).sort('-TotalTime').then(async (sites) => {
        if (!sites) {
          data.SiteO.Content = 'No Site'
          data.AverageEarningsO.Content = 0
        } else {
          data.SiteO.Content = sites.SiteName
          data.AverageEarningsO.Content = sites.AverageEarnings
        }
      }).catch(err => { res.status(500).send({ message: err }) })
      res.status(200).send(data)
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
        TotalSpent: sites[i].TotalSpent,
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
// #endregion
