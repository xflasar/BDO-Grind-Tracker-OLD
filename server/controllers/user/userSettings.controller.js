const UserSettings = require('../../db/models/settings.model')
const UserControllerHelper = require('../../helpers/user_controller.helper')
const User = require('../../db/models/user.model')

// GET
exports.GetUserSettingsData = async (req, res) => {
  try {
    const userSettings = await UserSettings.findOne({ userId: req.userId })

    if (!userSettings) {
      const userSettingsNew = new UserSettings({
        userId: req.userId
      })
      await userSettingsNew.save().then(() => {
        const user = User.findById(req.userId).then(user => {
          user.Settings = userSettingsNew._id
          user.save().then(() => {
            res.status(200).send(userSettingsNew)
          })
        })
      }).catch(error => { 
        console.error(error.message)
        return res.status(500).send({ message: error.message }) 
      })
    }

    const data = {
      region: userSettings.region,
      valuePack: userSettings.valuePack,
      merchantRing: userSettings.merchantRing,
      familyFame: userSettings.familyFame,
      tax: userSettings.tax
    }

    res.status(200).send(data)
  } catch (error) {
    console.error(error.message)
    res.status(500).send({ message: error.message })
  }
}

// SET
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
