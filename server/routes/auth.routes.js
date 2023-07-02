const { checkDuplicateUsernameOrEmail } = require('../middlewares/verifySignUp')
const controller = require('../controllers/auth.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, Content-Type, Accept'
    )
    next()
  })

  // Post
  app.post('/api/auth/signup', [checkDuplicateUsernameOrEmail], controller.signup)
  app.post('/api/auth/signin', controller.signin)
  app.post('/api/auth/signout', controller.signout)
}
