const controller = require('../controllers/app.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, Content-Type, Accept'
    )
    next()
  })

  // Sets
  app.post('/api/contactsend', controller.ContactSend)

  // Gets
  app.get('/api/globaldata', controller.GetHompageGlobalData)
}
