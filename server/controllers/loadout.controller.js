const User = require('../db/models/user.model')
const Loadout = require('../db/models/loadouts.model')

// GET
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

// SET
exports.AddUserLoadout = async (req, res) => {
  try {
    const loadoutObj = new Loadout({
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

// DELETE
exports.DeleteUserLoadout = async (req, res) => {
  try {
    await Loadout.findByIdAndDelete(req.body.loadoutId)

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

// PUT
exports.UpdateUserLoadout = async (req, res) => {
  try {
    const loadout = await Loadout.findByIdAndUpdate(req.body.loadoutId, {
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