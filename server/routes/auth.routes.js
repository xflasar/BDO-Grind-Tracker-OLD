const { checkDuplicateUsernameOrEmail, checkVerifiedEmail } = require('../middlewares/verifySignUp')
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
  app.post('/api/auth/signup', [checkVerifiedEmail], controller.signUp)
  app.post('/api/auth/signin', controller.signIn)
  app.post('/api/auth/signout', controller.signOut)
  app.post('/api/auth/verify-email', [checkDuplicateUsernameOrEmail], controller.verifyEmail)
  app.post('/api/auth/verify-code', controller.verifyCode)

  // Get
  app.get('/api/auth/access', controller.checkAuth)
}
