const User = require('../db/models/user.model.js');
const Session = require('../db/models/session.model.js');
const Site = require('../db/models/site.model.js');
const Auth = require('../db/models/auth.model.js');
const { dbConnect } = require('../db/method/dbconnect.js');

exports.UserData = async (req, res) => {
    // rewrite the db connection to use the dbConnect function
    User.findById(req.userId).populate('Sessions').populate('Sites').then(async (user) => {
        if (!user) {
            db.connection.close().then(() => { console.log("Connection closed!")});
            return res.status(404).send({ message: "User Not found." });
        }
        res.status(200).send(user);
    }).catch(err => { res.status(500).send({ message: err })});
}

exports.UserSessions = async (req, res) => {
    // rewrite the db connection to use the dbConnect function
    Session.find({UserId: req.userId}).then(async (sessions) => {
        if (!sessions) {
            db.connection.close().then(() => { console.log("Connection closed!")});
            return res.status(404).send({ message: "No sessions found." });
        }
        res.status(200).send(sessions);
    }).catch(err => { res.status(500).send({ message: err })});
}

exports.UserSites = async (req, res) => {
    // rewrite the db connection to use the dbConnect function
    Site.find({UserId: req.userId}).then(async (sites) => {
        if (!sites) {
            db.connection.close().then(() => { console.log("Connection closed!")});
            return res.status(404).send({ message: "No sites found." });
        }
        res.status(200).send(sites);
    }).catch(err => { res.status(500).send({ message: err })});
}

exports.AddSession = async (req, res) => {
    // rewrite the db connection to use the dbConnect function
    User.findById(req.userId).then(async (user) => {
        await Site.findOne({SiteName: req.body.SiteName}, {UserId: req.userId}).then(async site => {
            if (!site) {
                await this.AddSite(req, res);
                user.Sites.push([site._id])
            } else {
                req.body.SiteId = site.id;
                req.body.ModifySite = true;
                req.body.TimeSpent = req.body.TimeSpentSession;
                req.body.TotalEarned = req.body.EarningsSession;
                req.body.TotalSpent = req.body.ExpensesSession;
                req.body.AverageEarnings = req.body.AverageEarningsSession;
                await this.ModifySite(req, res);
            }
            
            const session = new Session({
                SiteId: site._id,
                TimeSpent: req.body.TimeSpentSession,
                Earnings: req.body.EarningsSession,
                AverageEarnings: req.body.AverageEarningsSession,
                Expenses: req.body.ExpensesSession,
                Gear: { TotalAP: req.body.TotalAP, TotalDP: req.body.TotalDP},
                TimeCreated: Date.now(),
                UserId: req.userId
            });
            await session.save().then( async (savedSession) => {
                user.Sessions.push([savedSession._id]);
                await user.save().then(() => {
                    res.status(200).send("Session added!");
                }).catch(err => { res.status(500).send({ message: err })});
                
            }).catch(err => { res.status(500).send({ message: err })});
        }).catch(err => { res.status(500).send({ message: err })});
    }).catch(err => {res.status(500).send({ message: err })});
}

exports.AddSite = async (req, res) => {
    // rewrite the db connection to use the dbConnect function
    const site = new Site({
        SiteName: req.body.SiteName,
        TotalTime: req.body.TotalTime,
        TotalEarned: req.body.TotalEarned,
        TotalSpent: req.body.TotalSpent,
        AverageEarnings: req.body.AverageEarnings,
        UserId: req.userId
    });

    await site.save().catch(err => { res.status(500).send({ message: err })});
}

// Think about a way to separate the calls to update the user and the site so we can use them independently with res.status(200).send(); in the end
exports.ModifySession = async (req, res) => {
    const updateObject = {};
    for (const key in req.body) {
        if (Session.schema.obj.hasOwnProperty(key)) {
            updateObject[key] = req.body[key];
        }
    }

    // rewrite the db connection to use the dbConnect function
    
    const updatedUser = await Session.findByIdAndUpdate(
      req.body.SessionId,
      { $set: { ...updateObject } },
      { new: true }
    ).then(async (session) => {
        req.body.SiteId = session.SiteId;
        req.body.TimeSpent = session.TimeSpent;
        req.body.TotalEarned = session.Earnings;
        req.body.TotalSpent = session.Expenses;
        req.body.AverageEarnings = session.AverageEarnings;
        req.body.ModifySite = true;
        await this.ModifySite(req, res);
        req.body.ModifyUser = true;
        await this.ModifyUserData(req, res);
        res.status(200).send("Session modified!");
    }).catch(err => { res.status(500).send({ message: err })});
}

// BUG: When ModifySite is called it doesn't update the user's data, it only updates the site's data
exports.ModifySite = async (req, res) => {
    // rewrite the db connection to use the dbConnect function
    const updateObject = {};
    if(req.body.ModifySite) {
        const objectToBeUpdated = await Site.findById(req.body.SiteId);
        updateObject.TotalTime = req.body.TimeSpent = objectToBeUpdated.TotalTime + req.body.TimeSpent;
        updateObject.TotalEarned = req.body.TotalEarned     = objectToBeUpdated.TotalEarned + req.body.TotalEarned;
        updateObject.TotalSpent = req.body.TotalSpent = objectToBeUpdated.TotalSpent + req.body.TotalSpent;
        updateObject.AverageEarnings = req.body.AverageEarnings = objectToBeUpdated.AverageEarnings + req.body.AverageEarnings;

        const updatedUser = await Site.findByIdAndUpdate(
            req.body.SiteId,
            { $set: { ...updateObject } },
            { new: true }
        );
    }
    else {
        updateObject.TotalTime = req.body.TimeSpent;
        updateObject.TotalEarned = req.body.TotalEarned;
        updateObject.TotalSpent = req.body.TotalSpent;
        updateObject.AverageEarnings = req.body.AverageEarnings;

        const updatedUser = await Site.findByIdAndUpdate(
            req.body.SiteId,
            { $set: { ...updateObject } },
            { new: true }
        );
        res.status(200).send("Site modified!");
    }
}

exports.ModifyUserData = async (req, res) => {
    // rewrite the db connection to use the dbConnect function
    const updateObject = {};
    if(req.body.ModifyUser) {
        updateObject.TotalTime = req.body.TimeSpent;
        updateObject.TotalEarnings = req.body.Earnings;
        updateObject.TotalExpenses = req.body.Expenses;

        const updatedUser = await User.findByIdAndUpdate(
          req.userId,
          { $set: { ...updateObject } },
          { new: true }
        );
    }
    else {
        updateObject.TotalTime = req.body.TotalTime;
        updateObject.TotalEarnings = req.body.TotalEarned;
        updateObject.TotalExpenses = req.body.TotalSpent;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $set: { ...updateObject } },
            { new: true }
        );
        res.status(200).send("UserData modified!");
    }
}

// This function will delete a session and update the user's data and the site's data
exports.DeleteSession = async (req, res) => {
    // rewrite the db connection to use the dbConnect function
    Session.findById(req.body.SessionId).then(async (session) => {
        req.body.SiteId = session.SiteId;
        req.body.TimeSpent = -session.TimeSpent;
        req.body.TotalEarned = -session.Earnings;
        req.body.TotalSpent = -session.Expenses;
        req.body.AverageEarnings = -session.AverageEarnings;
        req.body.ModifySite = true;
        await this.ModifySite(req, res);
        req.body.ModifyUser = true;
        await this.ModifyUserData(req, res);
        console.log(req.body);
        Session.findByIdAndDelete(req.body.SessionId).then(() => {
            res.status(200).send("Session deleted!");
        }).catch(err => { res.status(500).send({ message: err })});
    }).catch(err => { res.status(500).send({ message: err })});

}

// This is a dangerous function, it will delete all user data, including sessions and sites and authentication data | This function will be called when the user deletes his account
exports.DeleteUserData = async (req, res) => {
    let db = await dbConnect();
    Site.deleteMany({ UserId: req.userId }).then(() => {
        Session.deleteMany({ UserId: req.userId }).then(() => {
            User.findByIdAndDelete(req.userId).then(() => {
                Auth.findOneAndDelete({ UserId: req.userId }).then(() => {
                    try
                    {
                        req.session = null;
                        res.session.destroy();
                        res.status(200).send("User data deleted!");
                    }
                    catch(err)
                    {
                        res.status(500).send({ message: err });
                    }
                }).catch(err => { res.status(500).send({ message: err })});
            }).catch(err => { res.status(500).send({ message: err })});
        }).catch(err => { res.status(500).send({ message: err })});
    }).catch(err => { res.status(500).send({ message: err })});
    db.connection.close().then(() => { console.log("Connection closed!")});
}

// Functions for getting Data
exports.GetHomepageData = async (req, res) => {
    let db;
    try{
        db= await dbConnect();
        if(!db) {
            res.status(500).send({ message: "Error connecting to database!" });
        }
        try{
            let user = await User.findById(req.userId).then((user) => { return user; }).catch(err => { res.status(500).send({ message: err })});
            if(!user) {
                res.status(500).send({ message: "Error getting user data!" });
                return;
            }
            const data = {
                TotalTimeO:{

                    Title: "Total Time",
                    Content: user.TotalTime
                },
                TotalEarningsO:{
                    Title: "Total Earnings",
                    Content: user.TotalEarnings
                },
                TotalExpensesO:{
                    Title: "Total Expenses",
                    Content: user.TotalExpenses
                },
                AverageEarningsO:{
                    Title: "Average Earnings",
                    Content: 0
                },
                SiteO:{
                    Title: "Top Site",
                    Content: ""
                }
            }

            let site = await Site.findOne({ UserId: req.userId }).sort('-TotalTime').then((sites) => { db.connection.close().then(() => { console.log("Connection closed!")}); return sites; }).catch   (err => { res.status(500).send({ message: err })});
            if(!site) {
                res.status(500).send({ message: "Error getting site data!" });
                return;
            }
            data.AverageEarningsO.Content = site.AverageEarnings;
            data.SiteO.Content = site.SiteName;

            res.status(200).send(data);
        }
        catch(err)
        {
            console.log(err);
        }
    }catch(err)
    {
        console.log(err);
    }
}

exports.GetSiteData = async (req, res) => {
    let db;
    try {
        db = await dbConnect();
        if (!db) {
            res.status(500).send({ message: "Failed to connect to database!" });
            return;
        }
        try {
            let site = await Site.find({ UserId: req.userId }).then((site) => { db.connection.close().then(() => {
                console.log("Connection closed!");
            }); return site; })
            if (!site) {
                res.status(404).send({ message: "No site found!" });
                return;
            }
            const data = [];
            for (let i = 0; i < site.length; i++) {
                data.push({
                    SiteName: site[i].SiteName,
                    TotalTime: site[i].TotalTime,
                    TotalEarned: site[i].TotalEarned,
                    TotalSpent: site[i].TotalSpent,
                    AverageEarnings: site[i].AverageEarnings,
                });
            }
            res.status(200).send(data);
        } catch (err) {
            res.status(500).send({ message: err });
            console.log(err);
        }
    } catch (err) {
        console.log(err);
    }
};

exports.GetSessionsData = async (req, res) => {
    let db;
    try {
        db = await dbConnect();
        if (!db) {
            res.status(500).send({ message: "Failed to connect to database!" });
            return;
        }
        try {
            let session = await Session.find({ UserId: req.userId }).then((sessions) => { return sessions; })
            if (!session) {
                res.status(404).send({ message: "No session found!" });
                return;
            }
            const data = [];
            for(let i = 0; i < session.length; i++)
            {
                let date = new Date(session[i].TimeCreated);
                let siteName = await Site.findById(session[i].SiteId).then((site) => { return site.SiteName; }).catch(err => { throw err; });
                data.push({
                    Date: date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(),
                    SiteName: siteName,
                    TimeSpent: session[i].TimeSpent,
                    Earnings: session[i].Earnings,
                    AverageEarnings: session[i].AverageEarnings,
                    Expenses: session[i].Expenses,
                    Gear: session[i].Gear
                });
            }
            db.connection.close().then(() => {
                console.log("Connection closed!")});
            res.status(200).send(data);
        } catch (err) {
            res.status(500).send({ message: err });
            console.log(err);
        }
    } catch (err) {
        console.log(err);
    }
}