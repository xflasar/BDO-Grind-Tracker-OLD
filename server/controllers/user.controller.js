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
// Issue with user.Sites.push(site._id) and user.Sessions.push(session._id) not updating in the user document
exports.AddSession = (req, res) => {
    User.findOne({authenticationId: req.userId}).then(async (user) => {
        req.body.UserId = user._id;
        this.AddSite(req, res);
        Site.findOne({SiteName: req.body.SiteName}, {UserId: req.body.UserId}).then((site) => {user.Sites.push(site._id)});
            console.log("Site added to user");
            const session = new Session({
                SiteId: Site.findOne({SiteName: req.body.SiteName},    {UserId: req.body.UserId})._id,
                TimeSpent: req.body.TimeSpentSession,
                Earnings: req.body.EarningsSession,
                AverageEarnings: req.body.AverageEarningsSession,
                Expenses: req.body.ExpensesSession,
                Gear: { TotalAP: req.body.TotalAP, TotalDP: req.body.   TotalDP},
                TimeCreated: Date.now(),
                UserId: req.body.UserId
            });

            session.save().then( () => {
                user.Sessions.push(session._id);
                console.log(`Session ${session._id}`);
            }).catch(err => { res.status(500).send({ message:    err })});
        user.save().then(console.log(`User ${user._id} successfully updated`)).catch(err => { res.status(500).send({ message: err })});
        res.status(200).send("Session added!");
    }).catch(err => { console.log(err); res.status(500).send({ message: err })});
}

exports.AddSite = (req, res) => {
    const site = new Site({
        SiteName: req.body.SiteName,
        TotalTime: req.body.TotalTimeSite,
        TotalEarned: req.body.TotalEarnedSite,
        TotalSpent: req.body.TotalSpentSite,
        AverageEarnings: req.body.AverageEarningsSite,
        UserId: req.body.UserId
    });

    site.save().then(console.log(`Site ${site._id} successfully created for user: ${req.body.UserId}`)).catch(err => { res.status(500).send({ message: err })});
}

exports.ModifySession = (req, res) => {

}

exports.ModifySite = (req, res) => {

}

exports.ModifyUserData = (req, res) => {

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