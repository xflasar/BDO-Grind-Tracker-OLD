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

  app.get('/api/user/recentactivity', [verifyToken], controller.GetRecentActivity)

  app.get('/api/user/getaddsessionsites', [verifyToken], controller.GetAddSessionSites)
  app.get('/api/user/getaddsessionsitesitemdata/:siteId', [verifyToken], controller.GetAddSessionSitesItemData)

  // Data Add
  app.post('/api/user/addsession', [verifyToken], controller.AddSession)

  // Data Modify
  app.post('/api/user/modifysession', [verifyToken], controller.ModifySession)
  app.post('/api/user/modifysite', [verifyToken], controller.ModifySite)
  app.post('/api/user/modifyuserdata', [verifyToken], controller.ModifyUserData)

  // Data Delete
  app.post('/api/user/deletesession', [verifyToken], controller.DeleteSession)

  // Data Get routes
  // Homepage data
  app.get('/api/user/homepageuserdata', [verifyToken], controller.GetHomepageData)

  // Site data
  app.get('/api/user/sitedata', [verifyToken], controller.GetSiteData)

  // Sessions/history data
  app.get('/api/user/historydata', [verifyToken], controller.GetSessionsData)

  // Marketplace data
  app.post('/api/user/marketplace', [verifyToken], controller.GetMarketplaceData)
}
