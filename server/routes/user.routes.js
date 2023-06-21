const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const { verify } = require("jsonwebtoken");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/user/userdata", [verifyToken], controller.UserData);

    app.get('/api/user/userprofiledata', [verifyToken], controller.GetUserProfileData);

    app.post("/api/user/setuserprofiledata", [verifyToken], controller.SetUserProfileData);

    app.post('/api/user/setusersecuritydata', [verifyToken], controller.SetUserSecurityData)
    
    app.get("/api/user/usersettingsdata", [verifyToken], controller.GetUserSettingsData);

    app.post("/api/user/setusersettingsdata", [verifyToken], controller.SetUserSettingsData)

    app.get("/api/user/sessions", [verifyToken], controller.UserSessions);

    app.get("/api/user/sites", [verifyToken], controller.UserSites);

    app.post("/api/user/addsession", [verifyToken], controller.AddSession);

    app.post("/api/user/addsite", [verifyToken], controller.AddSite);

    app.post("/api/user/modifysession", [verifyToken], controller.ModifySession);

    app.post("/api/user/modifysite", [verifyToken], controller.ModifySite);

    app.post("/api/user/deletesession", [verifyToken], controller.DeleteSession);

    app.post("/api/user/modifyuserdata", [verifyToken], controller.ModifyUserData);

    // Data get routes
    // Homepage data
    app.get("/api/user/homepage", [verifyToken], controller.GetHomepageData);

    // Site data
    app.get("/api/user/sitedata", [verifyToken], controller.GetSiteData);

    // Sessions/history data
    app.get("/api/user/historydata", [verifyToken], controller.GetSessionsData);
}