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
  app.post('/api/auth/signup', [checkDuplicateUsernameOrEmail], controller.SignUp)
  app.post('/api/auth/signin', controller.SignIn)
  app.post('/api/auth/signout', controller.SignOut)

  // Get
  app.get('/api/auth/access', controller.CheckAuth)
}
