const fs = require('fs')
const bcrypt = require('bcryptjs')
const User = require('../db/models/user.model.js')
const Session = require('../db/models/session.model.js')
const Site = require('../db/models/site.model.js')
const Auth = require('../db/models/auth.model.js')
const Loadouts = require('../db/models/loadouts.model.js')
// const UserSiteData = require('../db/models/userSiteData.model.js')
const FreeImage = require('../services/freeImage.js')
const Items = require('../db/models/item.model.js')
const validator = require('../validators/user.validator.js')
const UserControllerHelper = require('../helpers/user_controller.helper.js')
const UserSettings = require('../db/models/settings.model.js')
const BDO_API = require('../services/bdo_api.js')

// #region Sets
exports.SetUserProfileData = (req, res) => {
  const profileData = {}

  for (const key in req.body) {
    if (Object.prototype.hasOwnProperty.call(User.schema.obj, key)) {
      profileData[key] = req.body[key]
    }
  }

  if (profileData.RecentActivity.length >= 10) profileData.RecentActivity.shift()

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
    let userSettings = await UserSettings.findOne({ userId: req.userId })

    const updateData = {
      region: req.body.regionServer,
      valuePack: req.body.valuePack,
      merchantRing: req.body.merchantRing,
      familyFame: req.body.familyFame,
      tax: UserControllerHelper.TaxCalculation({
        valuePack: req.body.valuePack,
        merchantRing: req.body.merchantRing,
        familyFame: req.body.familyFame
      })
    }

    if (!userSettings) {
      userSettings = new UserSettings({
        userId: req.userId,
        ...updateData
      })

      await userSettings.save()

      await UserControllerHelper.AddUserRecentActivity(User, req.userId, {
        activity: 'Settings created!',
        date: new Date()
      })
    }

    UserControllerHelper.UserSettingsModify(updateData, userSettings)

    await UserControllerHelper.AddUserRecentActivity(User, req.userId, {
      activity: 'Settings changed!',
      date: new Date()
    })

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

      if (user.RecentActivity.length >= 10) user.RecentActivity.shift()

      user.RecentActivity.push({
        activity: 'Uploaded profile picture!',
        date: new Date()
      })

      await user.save()
    } catch (error) {
      console.error(error.message)
      res.status(500).send({ message: error.message })
    }

    res.sendStatus(200)
  }
}
// #endregion

// #region Gets
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
  console.log('Testing Correct Data Submission!')
  return null

  // This will need big rewrite
  /* const validation = validator.AddSessionValidator(req.body)
  if (!validation.result) {
    return res.status(500).send(validation.errors)
  }

  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(500).send({ message: 'User not found!' })

    let site = await Site.findOne({ SiteName: req.body.SiteName }).populate({ path: 'SiteData', match: { UserId: req.userId } }).SiteData
    // Pre-update for add Session feature
    // if(!site) return res.status(500).send({ message: 'Site not found!' })

    if (!site) {
      site = await this.AddSite(req, res, true)
      user.Sites.push([site._id])
    }

    const sessionToAdd = await UserControllerHelper.CreateSession(Session, site.id, req.body, req.userId)

    if (!sessionToAdd) {
      return res.status(500).send({ message: 'Session not saved!' })
    }

    req.body.ModifySite = true
    req.body.SiteId = site._id
    await this.ModifySite(req, res)

    await UserControllerHelper.UpdateUserAfterSessionSaved(user, sessionToAdd, Session)

    // Here should be the site update later
    res.status(200).send(UserControllerHelper.SessionAddFormatedResponse(sessionToAdd, site))
  } catch (error) {
    console.error(error)
    res.status(500).send({ message: error })
  } */
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

    const updateData = {
      SiteId: updatedSession.SiteId,
      TotalTime: updatedSession.TimeSpent,
      TotalEarned: updatedSession.Earnings,
      TotalExpenses: updatedSession.Expenses,
      ModifySite: true,
      ModifyUser: true
    }

    await this.ModifySite({ ...req, body: updateData }, res)

    await this.ModifyUserData({ ...req, body: updateData }, res)

    await UserControllerHelper.AddUserRecentActivity(User, req.userId, {
      activity: 'Session edited!',
      date: new Date()
    })

    res.status(200).send({
      _id: updatedSession._id,
      Date: updatedSession.Date,
      TimeSpent: updatedSession.TimeSpent,
      Earnings: updatedSession.Earnings,
      Expenses: updatedSession.Expenses,
      Gear: updatedSession.Gear
    })
  } catch (err) {
    console.error('Error updating session:', err)
    res.status(500).send({ message: 'An error occured while updating the session.', err })
  }
}

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

exports.ModifyUserData = async (req, res) => {
  const updateObject = {
    TotalTime: req.body.TotalTime,
    TotalEarnings: req.body.TotalEarned,
    TotalExpenses: req.body.TotalExpenses,
    AverageEarnings: req.body.TotalEarned
  }

  const sumUserDataDoc = await UserControllerHelper.GetWeightedAverage(Session, null, req.userId, 'User')

  if (sumUserDataDoc.length === 0) req.body.ModifyUser = false

  if (req.body.ModifyUser) {
    updateObject.TotalTime = sumUserDataDoc[0].TotalTime
    updateObject.TotalEarned = sumUserDataDoc[0].TotalEarned
    updateObject.TotalExpenses = sumUserDataDoc[0].TotalExpenses
    updateObject.AverageEarnings = sumUserDataDoc[0].weightedAverage

    await User.findByIdAndUpdate(
      req.userId,
      { $set: { ...updateObject } },
      { new: true }
    )
  } else {
    await User.findByIdAndUpdate(
      req.userId,
      { $set: { ...updateObject } },
      { new: true }
    )
    res.status(200).send({ message: 'UserData modified!' })
  }
}
// #endregion

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
    const siteUpdate = await UserControllerHelper.GetWeightedAverage(Session, session.SiteId, null, 'Site', session._id)
    const userUpdate = await UserControllerHelper.GetWeightedAverage(Session, null, session.UserId, 'User', session._id)

    const defaultUpdate = {
      TotalTime: 0,
      TotalEarned: 0,
      TotalExpenses: 0,
      AverageEarnings: 0,
      weightedAverage: 0
    }

    if (userUpdate.length === 0 || userUpdate[0].TotalEntries === 0) {
      userUpdate.push(defaultUpdate)
    }

    if (siteUpdate.length === 0 || siteUpdate[0].TotalEntries === 0) {
      siteUpdate.push(defaultUpdate)
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

    await UserControllerHelper.AddUserRecentActivity(User, req.userId, { activity: 'Session deleted!', date: new Date() })

    this.GetSessionsData(req, res)
  } catch (err) {
    console.log('User Controller:', err)
    res.status(500).send({ message: 'An error occured while deleting the session!' })
  }
}

// This is a dangerous function, it will delete all user data, including sessions and sites and authentication data | This function will be called when the user deletes his account
exports.DeleteUserData = async (req, res) => {
  try {
    // Delete user-related data
    await Site.deleteMany({ UserId: req.userId })
    await Session.deleteMany({ UserId: req.userId })
    await User.findByIdAndDelete(req.userId)
    await Auth.findOneAndDelete({ UserId: req.userId })

    // Clear user session
    req.session = null
    res.session.destroy()

    res.status(200).send({ message: 'User data deleted!' })
  } catch (err) {
    console.log('Error deleting user data:', err)
    res.status(500).send({ message: 'An error occurred while deleting user data!' })
  }
}
// #endregion

// #region Data Get routes
// Homepage data
exports.GetHomepageData = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).send({ message: 'User not found!' })

    const homepageData = {
      TotalTime: user.TotalTime,
      TotalEarnings: user.TotalEarned,
      TotalExpenses: user.TotalExpenses,
      AverageEarnings: user.AverageEarnings,
      TopSite: 'No Site'
    }

    const sites = await Site.findOne({ UserId: req.userId }).sort('-TotalTime')

    if (sites) {
      homepageData.TopSite = sites.SiteName
    }

    res.status(200).send(homepageData)
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: err.message })
  }
}

// Site data
exports.GetSiteData = async (req, res) => {
  try {
    const sites = await Site.find({ UserId: req.userId })

    if (!sites || sites.length === 0) return res.status(404).send({ message: 'Sites not found!' })

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

// History data
exports.GetSessionsData = async (req, res) => {
  try {
    const sessions = await Session.find({ UserId: req.userId }).populate('SiteId').populate('GearId')

    if (!sessions || sessions.length === 0) {
      return res.status(200).send({ message: 'No sessions found!' })
    }

    const data = sessions.map((session) => ({
      _id: session._id,
      Date: UserControllerHelper.FormatSessionDate(session.TimeCreated),
      SiteName: session.SiteId.SiteName,
      TimeSpent: session.TimeSpent,
      Earnings: session.Earnings,
      AverageEarnings: session.AverageEarnings,
      Expenses: session.Expenses,
      Gear: { AP: session.GearId.AP, DP: session.GearId.DP }
    }))

    res.status(200).send(data)
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: err.message })
  }
}

// Marketplace
exports.GetMarketplaceData = async (req, res) => {
  try {
    // transfer to helper function
    /* if (!req.body.docCount) {
      req.body.docCount = await Items.countDocuments({ validMarketplace: true })
    }

    if (req.body.currentPage === 1) {
      req.body.currentPage = 0
    }

    const items = await Items.find({ validMarketplace: true }, {}, { skip: req.body.currentPage * req.body.recordsPerPage, limit: req.body.recordsPerPage })

    if (!items || items.length === 0) return res.status(500).send({ message: 'No items found!' })

    const data = {
      items: items.map(item => {
        return {
          _id: item.id,
          Name: item.name,
          Price: item.basePrice,
          Stock: item.currentStock,
          Image: 'https://' + item.icon
        }
      }),
      totalItems: req.body.docCount
    } */
    const searchData = {
      docCount: req.body.docCount,
      currentPage: req.body.currentPage
    }
    const responseData = await BDO_API.GetMarketplaceCategoryData(searchData, req.body.searchData.mainCategory, req.body.searchData.subCategory)
    const data = {
      items: responseData.fixItems,
      totalItems: responseData.totalItems
    }

    res.status(200).send(data)
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: err.message })
  }
}
// #endregion

exports.GetTax = async (req, res) => {
  try {
    const tax = await User.findById(req.userId).populate({ path: 'Settings', select: 'tax' }).select('Settings').then(data => data.Settings.tax)

    if (!tax) return res.status(404).send({ message: 'Tax not found!' })

    return res.status(200).send({ tax })
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }
}

exports.GetUserLoadouts = async (req, res) => {
  try {
    const user = await User.findById(req.userId, 'UserLoadouts').populate('UserLoadouts')
    if (!user || user.UserLoadouts.length === 0) return res.status(200).send({ message: 'No loadouts found!' })

    const loadoutsArr = []

    user.UserLoadouts.forEach((loadout) => {
      const loadoutObj = {
        id: loadout._id,
        name: loadout.name,
        class: loadout.class,
        AP: loadout.AP,
        DP: loadout.DP
      }
      loadoutsArr.push(loadoutObj)
    })

    res.status(200).send(loadoutsArr)
  } catch (err) {
    console.log(err)
  }
}

exports.AddUserLoadout = async (req, res) => {
  try {
    const loadoutObj = new Loadouts({
      UserId: req.userId,
      name: req.body.loadoutName,
      class: req.body.loadoutClass,
      AP: req.body.loadoutAP,
      DP: req.body.loadoutDP
    })
    await loadoutObj.save()

    await User.findByIdAndUpdate(req.userId, { $push: { UserLoadouts: loadoutObj._id } })

    res.status(200).send({ id: loadoutObj._id, name: loadoutObj.name, class: loadoutObj.class, AP: loadoutObj.AP, DP: loadoutObj.DP })
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: err.message })
  }
}

exports.DeleteUserLoadout = async (req, res) => {
  try {
    await Loadouts.findByIdAndDelete(req.body.loadoutId)

    await User.findByIdAndUpdate(req.userId, { $pull: { UserLoadouts: req.body.loadoutId } })

    let loadouts = await Loadouts.find({ UserId: req.userId })
    if (!loadouts) loadouts = []

    loadouts = loadouts.map((loadout) => ({
      id: loadout._id,
      name: loadout.name,
      class: loadout.class,
      AP: loadout.AP,
      DP: loadout.DP
    }))

    res.status(200).send(loadouts)
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: err.message })
  }
}

exports.UpdateUserLoadout = async (req, res) => {
  try {
    const loadout = await Loadouts.findByIdAndUpdate(req.body.loadoutId, {
      $set: {
        name: req.body.loadoutName,
        class: req.body.loadoutClass,
        AP: req.body.loadoutAP,
        DP: req.body.loadoutDP
      }
    },
    { new: true })

    res.status(200).send({ id: loadout._id, name: loadout.name, class: loadout.class, AP: loadout.AP, DP: loadout.DP })
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: err.message })
  }
}

exports.InsertSitesDataFromJson = async () => {
  /* await Site.deleteMany({}).then((result) => console.log('Deleted all sites from db => ' + result.deletedCount))
  return null */
  const jsonSiteData = fs.readFileSync('C:/Users/HomePC/source/repos/BDO-Grind-Tracker/server/temp_data/Site_data.json', 'utf8')
  const SitesData = JSON.parse(jsonSiteData)
  const DataToFix = []
  const bulkInsertOperations = []
  for (const site of Object.values(SitesData)) {
    const dropItemsTemp = []
    for (let dropItem of Object.values(site.DropItems)) {
      dropItem = dropItem.replace("'", '&#39;')
      const itemDB = await Items.findOne({ name: dropItem })

      const itemObj = {
        itemId: null,
        itemName: ''
      }

      if (itemDB) {
        itemObj.itemId = itemDB._id
        itemObj.itemName = itemDB.name
        dropItemsTemp.push(itemObj)
      } else {
        DataToFix.push({
          name: dropItem,
          itemdb: 'Not Found',
          id: 'Not Found'
        })
        itemObj.itemId = null
        itemObj.itemName = dropItem
        dropItemsTemp.push(itemObj)
      }
    }
    site.DropItems = dropItemsTemp
    bulkInsertOperations.push({
      insertOne: {
        document: site
      }
    })
  }

  fs.writeFileSync('C:/Users/HomePC/source/repos/BDO-Grind-Tracker/server/temp_data/Site_data_fixed.json', JSON.stringify(DataToFix))

  await Site.bulkWrite(bulkInsertOperations).then((result) => console.log('Finished inserting data to db => ' + result.insertedCount))

  console.log('Done With ISDFJ')
}

exports.InsertItemDataFromJson = async () => {
  const jsonItemData = fs.readFileSync('C:/Users/HomePC/source/repos/BDO-Grind-Tracker/server/temp_data/ids.json', 'utf8')
  const itemData = JSON.parse(jsonItemData)
  itemData.map((item) => {
    item.basePrice = item.basePrice.replaceAll(',', '')
    return item
  })

  const itemsWithoutDuplicates = itemData.reduce((uniqueItems, item) =>
    uniqueItems.some(existingItem => existingItem.id === item.id)
      ? uniqueItems
      : [...uniqueItems, item], [])

  const bulkUpdateOperations = []

  for (const item of itemsWithoutDuplicates) {
    bulkUpdateOperations.push({
      updateOne: {
        filter: { id: item.id },
        update: {
          basePrice: item.basePrice
        }
      }
    })
  }

  const validBulkUpdateOperations = bulkUpdateOperations.filter(op => op)

  try {
    await Items.bulkWrite(validBulkUpdateOperations).then((result, error) => console.log('Finished editing data to db => ' + result.modifiedCount + 'Errors: ' + error))
  } catch (error) {
    console.log(error)
  }
}
