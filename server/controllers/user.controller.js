const fs = require('fs')
const User = require('../db/models/user.model.js')
const Session = require('../db/models/session.model.js')
const Site = require('../db/models/site.model.js')
const Auth = require('../db/models/auth.model.js')
const Loadouts = require('../db/models/loadouts.model.js')
const FreeImage = require('../services/freeImage.js')
const Items = require('../db/models/item.model.js')
// const validator = require('../validators/user.validator.js')



// #region Sets
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

exports.GetRecentActivity = async (req, res) => {
  try {
    const recentActivityArr = await User.findById(req.userId).select({ _id: 1, RecentActivity: { $slice: -5 } }).lean()

    if (!recentActivityArr) return res.status(500).send({ message: 'User not found!' })

    const data = {
      RecentActivity: recentActivityArr.RecentActivity.map((activity) => {
        return {
          date: `${activity.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} ${activity.date.toLocaleDateString('en-US')}`,
          activity: activity.activity
        }
      })
    }

    res.status(200).send(data)
  } catch (error) {
    console.error(error.message)
    res.status(500).send({ message: error.message })
  }
}
// #endregion


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

// Custom exports functions

// Retrieves Tax
exports.GetTax = async (req, res) => {
  try {
    const tax = await User.findById(req.userId).populate({ path: 'Settings', select: 'tax' }).select('Settings').then(data => data.Settings.tax)

    if (!tax) return res.status(404).send({ message: 'Tax not found!' })

    return res.status(200).send({ tax })
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }
}

// Takes Site data from JSON file and dumps it into database for Sites
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

// Takes Items data from JSON file and dumps it into database for Items
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

// Gets all Items from DB and sets Base price to 0 if it doesn't have BasePrice field
exports.ZeroItemsBasePrice = async () => {
  await Items.updateMany({ basePrice: { $exists: false } }, { basePrice: 0 }).then((result) => { console.log('Edditing done: ' + result.modifiedCount) })
}