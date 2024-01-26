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

  app.get('/api/user/getloadouts', [verifyToken], controller.GetUserLoadouts)

  app.get('/api/user/gettax', [verifyToken], controller.GetTax)

  // Data Add
  app.post('/api/user/addsession', [verifyToken], controller.AddSession)
  app.post('/api/user/addloadout', [verifyToken], controller.AddUserLoadout)

  // Data Modify :fix to patch
  app.post('/api/user/editsession', [verifyToken], controller.EditSession)
  app.post('/api/user/modifysite', [verifyToken], controller.ModifySite)
  app.post('/api/user/modifyuserdata', [verifyToken], controller.ModifyUserData)
  app.patch('/api/user/updateloadout', [verifyToken], controller.UpdateUserLoadout)

  // Data Delete :fix to delete
  app.post('/api/user/deletesession', [verifyToken], controller.DeleteSession)
  app.delete('/api/user/deleteloadout', [verifyToken], controller.DeleteUserLoadout)

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
