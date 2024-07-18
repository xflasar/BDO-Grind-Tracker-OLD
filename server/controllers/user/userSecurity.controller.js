const Auth = require('../../db/models/auth.model')
const UserControllerHelper = require('../../helpers/user_controller.helper')
const User = require('../../db/models/user.model')
const bcrypt = require('bcryptjs')

// SET
exports.SetUserSecurityData = async (req, res) => {
  console.log('SetUserSecurity')
  console.log(req)
  try {
    const auth = await Auth.findById(req.authId )
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