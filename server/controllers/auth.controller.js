const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const config = require('../config/auth.config.js')
const Auth = require('../db/models/auth.model.js')
const User = require('../db/models/user.model.js')
const UserSettings = require('../db/models/settings.model.js')
const AuthVerification = require('../db/models/authVerification.model.js')
const { sendVerifyEmail } = require('../helpers/sendVerifyEmail.helper.js')

exports.signUp = async (req, res) => {
  try {
    // Get Email verification and delete it
    await AuthVerification.findOne({
      email: req.body.email
    }).then(async (verification) => {
      if (verification) {
        await verification.deleteOne()
      }
    })

    const validationErrors = await validateRegistrationData(req.body.username, req.body.email, req.body.password)

    if (validationErrors.length > 0) {
      return res.status(400).send({ message: 'Validation fail.', errorsList: validationErrors })
    }

    const auth = new Auth({
      username: await req.body.username,
      email: await req.body.email,
      password: await bcrypt.hash(req.body.password, 8)
    })

    await auth.save()

    const user = new User({
      DisplayName: '',
      TotalTime: 0,
      TotalEarnings: 0,
      Sites: [],
      TotalExpenses: 0,
      authenticationId: auth._id,
      Sessions: [],
      Settings: null
    })

    await user.save()
    user.Settings = new UserSettings({ userId: user._id })
    user.Settings.save()

    auth.UserId = user._id
    await auth.save()

    const token = await jwt.sign({ id: userAuth.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    })

    req.session.token = token
    res.status(200).send({ accessToken: token, message: 'User was registered successfully!' })
  } catch (error) {
    await user.Settings.deleteOne()
    await user.deleteOne()
    await auth.deleteOne()

    res.status(500).send({ message: error.message })
  }
}

exports.signIn = async (req, res) => {
  try {
    const auth = await Auth.findOne({ username: req.body.username })
    if (!auth) return res.status(404).send({ message: 'User Not found.' })
    
    await auth.populate('UserId')

    const passwordIsValid = await bcrypt.compareSync(
      req.body.password,
      auth.password
    )

    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Invalid Password!' })
    }

    const token = await jwt.sign({ id: auth.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    })

    req.session.token = token

    if (auth.UserId.ImageUrl == null) auth.UserId.ImageUrl = '' // Fix for now

    await res.status(200).send({
      userData: {
        ImageUrl: auth.UserId.ImageUrl
      }
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

exports.signOut = (req, res) => {
  try {
    req.session = null
    return res.status(200).send({ message: 'Successfully signed out!' })
  } catch (err) {
    console.log(err)
  }
}

exports.checkAuth = (req, res) => {
  if (req.session.token == null) return res.status(200).send({ message: 'Not logged in!' })
  jwt.verify(req.session.token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' + err })
    }
    return res.status(200).send({ message: 'Authorized!' })
  })
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

exports.verifyEmail = async (req, res) => {
  try {
    // Check for email existing
    await Auth.findOne({ email: req.body.email }).then(async (auth) => {
      if (auth) {
        return res.status(400).send({ message: 'Email already exists.' })
      }
    })

    const verificationOld = await AuthVerification.findOne({ email: req.body.email })
    if (verificationOld) {
      return res.status(200).send({ message: 'Email already exists.' })
    }

    const verification = new AuthVerification({
      email: req.body.email
    })


   const code = crypto.randomInt(100000, 999999).toString()

    verification.otp = code

    verification.createdAt = new Date() // Set the creation time to the current time

    const emailSent = await sendVerifyEmail(req.body.email, code)
    await verification.save().then(() => {
      console.log('Verification email sent and saved into db.')
      return res.send({ message: 'Verification email sent.' })
     }).catch(err => { 
      console.log(err)
      return res.status(500).send({ message: err })
     })
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: err })
  }
}

exports.verifyCode = async (req, res) => {
  try {
    const verification = await AuthVerification.findOne({ email: req.body.email })

    if (!verification) {
      return res.status(404).send({ message: 'Verification not found.' })
    }

    const isExpired = new Date(verification.createdAt.getTime() + 5 * 60 * 1000) < new Date()

    if (isExpired) {
      await verification.deleteOne() // Delete database entry to allow reverification
      return res.status(400).send({ message: 'Verification code expired.' })
    }

    const isValid = req.body.code === verification.otp

    if (!isValid) {
      return res.status(400).send({ message: 'Invalid verification code.' })
    }

    res.status(200).send({ message: 'Email verified successfully.' })
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: 'Error verifying email.' })
  }
}