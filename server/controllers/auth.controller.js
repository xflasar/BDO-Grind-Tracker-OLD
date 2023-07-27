const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../config/auth.config.js')
const Auth = require('../db/models/auth.model.js')
const User = require('../db/models/user.model.js')
const UserSettings = require('../db/models/settings.model.js')

exports.signup = async (req, res) => {
  const validationErrors = await validateRegistrationData(req.body.username, req.body.email, req.body.password)

  if (validationErrors.length > 0) {
    return res.status(400).send({ message: 'Validation fail.', errorsList: validationErrors })
  }

  const auth = new Auth({
    username: await req.body.username,
    email: await req.body.email,
    password: await bcrypt.hash(req.body.password, 8)
  })

  auth.save().then(() => {
    const user = new User({
      DisplayName: req.body.displayName,
      TotalTime: 0,
      TotalEarnings: 0,
      Sites: [],
      TotalExpenses: 0,
      authenticationId: auth._id,
      Sessions: [],
      Settings: null
    })

    user.save()
    user.Settings = new UserSettings({ userId: user._id })
    user.Settings.save()
    auth.UserId = user._id
    auth.save().then(async (userAuth) => {
      const token = await jwt.sign({ id: userAuth.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      })
      req.session.token = token
      res.status(200).send({ accessToken: token, message: 'User was registered successfully!' })
    }).catch(err => { res.status(500).send({ message: err }) })
  }).catch(err => {
    res.status(500).send({ message: err })
  })
}

exports.signin = (req, res) => {
  Auth.findOne({
    username: req.body.username
  }).populate('UserId').then(async (user) => {
    if (!user) {
      return await res.status(401).send({ message: 'User not found.' })
    }

    const passwordIsValid = await bcrypt.compareSync(
      req.body.password,
      user.password
    )

    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Invalid Password!' })
    }

    const token = await jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    })

    req.session.token = token

    await res.status(200).send({
      userData: {
        ImageUrl: user.UserId.ImageUrl
      },
      accessToken: token
    })
  }).catch(err => { res.status(500).send({ message: err }) })
}

exports.signout = (req, res) => {
  try {
    req.session = null
    return res.status(200).send({ message: 'Successfully signed out!' })
  } catch (err) {
    console.log(err)
  }
}

const validateRegistrationData = (username, email, password) => {
  const validationErrors = []
  if (username.length < 3 || username.length > 20) {
    validationErrors.push({ type: 'username', message: 'Username must be at least 3 characters long.' })
  }
  if (!email.includes('@')) {
    validationErrors.push({ type: 'email', message: 'Email must be in a valid format.' })
  }
  if (password.length < 8) {
    validationErrors.push({ type: 'password', message: 'Password must be at least 8 characters long.' })
  }
  return validationErrors
}
