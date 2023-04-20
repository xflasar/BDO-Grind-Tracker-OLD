const User = require('../db/models/user.model.js');
const Session = require('../db/models/session.model.js');
const Site = require('../db/models/site.model.js');

exports.allAcesss = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
}

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
}

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
}

exports.UserData = (req, res) => {
    console.log(req.userId);
    User.findOne({authenticationId: req.userId}).populate('Sessions').populate('Sites').then(async (user) => {
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        res.status(200).send(user);
    }).catch(err => { res.status(500).send({ message: err })});
}

// TODO: Make a validation for site to not be added twice to the same user (check if site exists in user.Sites) if it does, don't add it again but add the session to the site and update the site's data (time, earnings, expenses, etc)
exports.AddSession = (req, res) => {
    User.findOne({authenticationId: req.userId}).then(async (user) => {
        req.body.UserId = user.id;
        await Site.findOne({SiteName: req.body.SiteName}, {UserId: req.body.UserId}).then(async site => {
            if (!site) {
                await this.AddSite(req, res);
            } else {
                req.body.SiteId = site.id;
                await this.ModifySite(req, res);
                console.log(site);
                user.Sites.push([site._id])

                console.log("Site added to user");
                const session = new Session({
                    SiteId: site._id,
                    TimeSpent: req.body.TimeSpentSession,
                    Earnings: req.body.EarningsSession,
                    AverageEarnings: req.body.AverageEarningsSession,
                    Expenses: req.body.ExpensesSession,
                    Gear: { TotalAP: req.body.TotalAP, TotalDP: req.body.TotalDP},
                    TimeCreated: Date.now(),
                    UserId: req.body.UserId
                });

                await session.save().then( async (savedSession) => {
                    user.Sessions.push([savedSession._id]);
                    console.log(`Session ${savedSession._id}`);
                    await user.save().then(() => {
                        console.log(`User ${user.id} successfully updated`);
                        res.status(200).send("Session added!");
                    }).catch(err => { res.status(500).send({ message: err })});
                    
                }).catch(err => { res.status(500).send({ message: err })});
            }
        }).catch(err => { res.status(500).send({ message: err })});
    }).catch(err => { console.log(err); res.status(500).send({ message: err })});
}

exports.AddSite = async (req, res) => {
    const site = new Site({
        SiteName: req.body.SiteName,
        TotalTime: req.body.TotalTimeSite,
        TotalEarned: req.body.TotalEarnedSite,
        TotalSpent: req.body.TotalSpentSite,
        AverageEarnings: req.body.AverageEarningsSite,
        UserId: req.body.UserId
    });

    await site.save().then(console.log(`Site ${site.id} successfully created for user: ${req.body.UserId}`)).catch(err => { res.status(500).send({ message: err })});
}

// Think about a way to separate the calls to update the user and the site so we can use them independently with res.status(200).send(); in the end
exports.ModifySession = async (req, res) => {
    const updateObject = {};
    for (const key in req.body) {
      if (Session.schema.obj.hasOwnProperty(key)) {
        updateObject[key] = req.body[key];
      }
    }

    const updatedUser = await Session.findByIdAndUpdate(
      req.body.SessionId,
      { $set: { ...updateObject } },
      { new: true }
    ).then(async (session) => {
        req.body.SiteId = session.SiteId;
        await this.ModifySite(req, res);
        req.body.UserId = session.UserId;
        await this.ModifyUserData(req, res);
        res.status(200).send("Session modified!");
    }).catch(err => { res.status(500).send({ message: err })});
}

exports.ModifySite = async (req, res) => {
    const updateObject = {};
    const objectToBeUpdated = await Site.findById(req.body.SiteId);
    updateObject.TotalTime, req.body.TimeSpent = objectToBeUpdated.TotalTime + req.body.TimeSpent;
    updateObject.TotalEarned, req.body.Earnings = objectToBeUpdated.TotalEarned + req.body.Earnings;
    updateObject.TotalSpent, req.body.Expenses = objectToBeUpdated.TotalSpent + req.body.Expenses;
    updateObject.AverageEarnings, req.body.AverageEarnings = objectToBeUpdated.AverageEarnings + req.body.AverageEarnings;

    const updatedUser = await Site.findByIdAndUpdate(
      req.body.SiteId,
      { $set: { ...updateObject } },
      { new: true }
    );

}

exports.ModifyUserData = async (req, res) => {
    const updateObject = {};
    updateObject.TotalTime = req.body.TimeSpent;
    updateObject.TotalEarnings = req.body.Earnings;
    updateObject.TotalExpenses = req.body.Expenses;

    const updatedUser = await User.findByIdAndUpdate(
      req.body.UserId,
      { $set: { ...updateObject } },
      { new: true }
    );
}

exports.DeleteSession = (req, res) => {
    
}

exports.DeleteSite = (req, res) => {

}

// This is a dangerous function, it will delete all user data, including sessions and sites and authentication data
exports.DeleteUserData = (req, res) => {

}

exports.DeleteUser = (req, res) => {

}