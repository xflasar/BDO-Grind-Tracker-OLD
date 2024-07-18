const Site = require('../db/models/site.model')
const User = require('../db/models/user.model')
const Session = require('../db/models/session.model')


exports.ClearSitesSiteData = () => {
  const ObjRes = {
    success: true,
    TotalAffected: 0,
    TotalUnsuccesful: 0,
    Total: 0
  }

  Site.find().then(sites => {
    ObjRes.Total = sites.length
    try {
      sites.forEach(site => {
        site.SiteData = []
  
        site.save().then(() => {
          ObjRes.TotalAffected++
        }).catch(err => {
          ObjRes.TotalUnsuccesful++
          console.log(err)
        })
      })

      ObjRes.success = true
    } catch (error) {
      ObjRes.success = false
    }
  })
  console.log(ObjRes.Total, ObjRes.TotalAffected, ObjRes.TotalUnsuccesful, ObjRes.success)
}

exports.DeleteSessionsData = () => {
  const ObjRes = {
    success: true,
    TotalAffected: 0,
    TotalUnsuccesful: 0,
    Total: 0
  }

  Session.find().then(sessions => {
    ObjRes.Total = sessions.length
    try {
      sessions.forEach(session => {
        Session.findByIdAndDelete(session._id).then(() => {
          ObjRes.TotalAffected++
        }).catch(err => {
          ObjRes.TotalUnsuccesful++
          console.log(err)
        })
      })

      ObjRes.success = true
    } catch (error) {
      ObjRes.success = false
    }
  })

  User.find().then(users => {
    ObjRes.Total = users.length
    try {
      users.forEach(user => {
        user.RecentActivity = []
        user.Sessions = []
        user.Sites = []
        user.AverageEarnings = 0
        user.TotalTime = 0
        user.TotalEarned = 0

        user.save().then(() => {
          ObjRes.TotalAffected++
        }).catch(err => {
          ObjRes.TotalUnsuccesful++
          console.log(err)
        })
      })

      ObjRes.success = true
    } catch (error) {
      ObjRes.success = false
    }
  })

  Site.find().then(sites => {
    ObjRes.Total = sites.length
    try {
      sites.forEach(site => {
        site.SiteData = []

        site.save().then(() => {
          ObjRes.TotalAffected++
        }).catch(err => {
          ObjRes.TotalUnsuccesful++
          console.log(err)
        })
      })

      ObjRes.success = true
    } catch (error) {
      ObjRes.success = false
    }
  })

  console.log(ObjRes.Total, ObjRes.TotalAffected, ObjRes.TotalUnsuccesful, ObjRes.success)
}