const jwt = require('jsonwebtoken')
const config = require('../config/auth.config.js')
const Auth = require('../db/models/auth.model.js')

const verifyToken = async (req, res, next) => {
  const token = req.session.token

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' })
  }

  const isTokenValid = await jwt.verify(token, config.secret, async (err, decoded) => {
    if (err) {
      res.status(401).send({ message: 'Unauthorized!' })
      return false
    }
    decoded.exp = Date.now() / 1000 + (1 * 24 * 60 * 60)
    const newAccessToken = jwt.sign(decoded, config.secret)
    req.session.token = newAccessToken
    req.authId = decoded.id
    return true
  })

  if (!isTokenValid) return false

  Auth.findById(req.authId).then(async (userAuth) => {
    if (!userAuth) {
      return await res.status(401).send({ message: 'User Not found. Auth' })
    }
    req.userId = userAuth.UserId.toString()
    next()
  }).catch(err => { res.status(500).send({ message: err }) })
}

const isAdmin = (req, res, next) => {
  Auth.findById(req.authId).then(async (user) => {
    if (user.role !== 'admin') {
      await res.status(403).send({ message: 'Require Admin Role!' })
      return
    }
    next()
  }).catch(err => { res.status(500).send({ message: err }) })
}

module.exports = {
  verifyToken,
  isAdmin
}
