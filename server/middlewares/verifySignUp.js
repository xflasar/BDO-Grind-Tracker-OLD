const Auth = require('../db/models/auth.model.js')
const AuthVerification = require('../db/models/authVerification.model.js')
const { verifyToken } = require('./authJwt.js')

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Username
    const username = await Auth.findOne({
      username: req.body.username
    })
  
    if (username) {
      return res.status(400).send({ message: 'Failed! Username is already taken!' })
    }
    
    // Email
    const email = await Auth.findOne({
      email: req.body.email
    })

    if (email) {
      return res.status(400).send({ message: 'Failed! Email is already in use!' })
    } else {
      next()
    }

  } catch (err) {
    res.status(401).send({ message: 'Unauthorized!' })
    return
  }
}

const checkVerifiedEmail = async (req, res, next) => {
  try {
    const checkState = checkDuplicateUsernameOrEmail(req, res, next)
    
    // we need to check it if we got error since node just goes thru the middleware then stops 
    // If we get res return then we return from this middleware function if not we continue with no error
    if (checkState) return
  
    const verification = await AuthVerification.findOne({
      email: req.body.email
    })

    if (!verification) {
      return res.status(400).send({ message: 'Failed! Email is not verified!' })
    } else if (req.body.code !== verification.otp) {
      return res.status(400).send({ message: 'Failed! Invalid verification code!' })
    } else {
      next()
    }
  } catch (err) {
    console.log(err)
    return res.status(401).send({ message: 'Unauthorized!' })
  }
}

module.exports = { checkDuplicateUsernameOrEmail, checkVerifiedEmail }
