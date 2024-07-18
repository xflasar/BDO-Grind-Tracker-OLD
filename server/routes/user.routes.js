const controller = require('../controllers/user.controller')
const { verifyToken } = require('../middlewares/authJwt')
const userProfileRoutes = require('./user/userProfile.routes')
const userSettingsRoutes = require('./user/userSettings.routes')
const userSecurityRoutes = require('./user/userSecurity.routes')
const loadoutRoutes = require('./loadout.routes')
const sessionRoutes = require('./session.routes')
const siteRoutes = require('./site.routes')
const marketplaceRoutes = require('./marketplace.routes')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  app.use('/api/user/profile', userProfileRoutes)
  app.use('/api/user/profile/settings', userSettingsRoutes)
  app.use('/api/user/profile/security', userSecurityRoutes)
  app.use('/api/user/loadouts', loadoutRoutes)
  app.use('/api/user/sessions', sessionRoutes)
  app.use('/api/user/sites', siteRoutes)

  app.use('/api/user/marketplace', marketplaceRoutes) // move to app.routes.js

  // In-Routes
  app.get('/api/user/gettax', [verifyToken], controller.GetTax)
  app.get('/api/user/homedata', [verifyToken], controller.GetHomepageData)
  app.get('/api/user/recentactivity', [verifyToken], controller.GetRecentActivity)

  /* // Sets
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
  app.get('/api/user/sessions', [verifyToken], controller.GetSessionsData)
  app.get('/api/user/sessions/sites', [verifyToken], controller.GetSessionSites)

  // Marketplace data
  app.post('/api/user/marketplace', [verifyToken], controller.GetMarketplaceData) */
}
