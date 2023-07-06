const controller = require('../controllers/user.controller')
const { verifyToken } = require('../middlewares/authJwt')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  // Sets
  app.post('/api/user/setuserprofiledata', [verifyToken], controller.SetUserProfileData)
  app.post('/api/user/setusersecuritydata', [verifyToken], controller.SetUserSecurityData)
  app.post('/api/user/setusersettingsdata', [verifyToken], controller.SetUserSettingsData)
  app.post('/api/user/uploadprofilepicture', [verifyToken], controller.UploadProfilePicture)

  // Gets
  app.get('/api/user/userprofiledata', [verifyToken], controller.GetUserProfileData)
  app.get('/api/user/usersettingsdata', [verifyToken], controller.GetUserSettingsData)

  // Data Add
  app.post('/api/user/addsession', [verifyToken], controller.AddSession)
  app.post('/api/user/addsite', [verifyToken], controller.AddSite)

  // Data Modify
  app.post('/api/user/modifysession', [verifyToken], controller.ModifySession)
  app.post('/api/user/modifysite', [verifyToken], controller.ModifySite)
  app.post('/api/user/modifyuserdata', [verifyToken], controller.ModifyUserData)

  // Data Delete
  app.post('/api/user/deletesession', [verifyToken], controller.DeleteSession)

  // Data Get routes
  // Homepage data
  app.get('/api/user/homepage', [verifyToken], controller.GetHomepageData)

  // Site data
  app.get('/api/user/sitedata', [verifyToken], controller.GetSiteData)

  // Sessions/history data
  app.get('/api/user/historydata', [verifyToken], controller.GetSessionsData)
}
