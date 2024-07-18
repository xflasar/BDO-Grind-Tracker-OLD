const mongoose = require('mongoose');

const userSiteDataSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    SiteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site'
    },
    TotalTime: {
        type: Number
    },
    TotalEarned: {
        type: Number
    },
    AverageEarnings: {
        type: Number
    },
    TotalSpent: {
        type: Number
    },
    Sessions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session'
    }
})

const UserSiteData = mongoose.model('UserSiteData', userSiteDataSchema, 'UserSiteData')