const User = require('../../db/models/user.model')

// GET
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

// SET
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
