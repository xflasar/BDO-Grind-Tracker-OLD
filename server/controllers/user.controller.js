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
        await this.AddSite(req, res);
        await Site.findOne({SiteName: req.body.SiteName}, {UserId: req.body.UserId}).then(async site => {
            console.log(site);
            user.Sites.push([site._id])

            console.log("Site added to user");
            const session = new Session({
                SiteId: site._id,
                TimeSpent: req.body.TimeSpentSession,
                Earnings: req.body.EarningsSession,
                AverageEarnings: req.body.AverageEarningsSession,
                Expenses: req.body.ExpensesSession,
                Gear: { TotalAP: req.body.TotalAP, TotalDP: req.body.   TotalDP},
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
                
            }).catch(err => { res.status(500).send({ message:    err })});
            
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