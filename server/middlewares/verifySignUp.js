const Auth = require('../db/models/auth.model.js')

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  Auth.findOne({
    username: req.body.username
  }).then(async (user) => {
    if (user) {
      await res.status(400).send({ message: 'Failed! Username is already in use!' })
      return
    }

    // Email
    Auth.findOne({
      email: req.body.email
    }).then(async (user) => {
      if (user) {
        await res.status(400).send({ message: 'Failed! Email is already in use!' })
        return
      }

      next()
    }).catch(err => { res.status(500).send({ message: err }) })
  }).catch(err => { res.status(500).send({ message: err }) })
}

module.exports = { checkDuplicateUsernameOrEmail }
