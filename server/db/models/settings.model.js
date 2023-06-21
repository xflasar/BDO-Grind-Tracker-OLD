const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  valuePack: {
    type: Boolean,
    default: false,
  },
  merchantRing: {
    type: Boolean,
    default: false,
  },
  familyFame: {
    type: Number,
    default: false,
  },
  tax: {
    type: Number,
    default: -0.35,
  }
});

const UserSettings = mongoose.model('UserSettings', settingsSchema, 'UserSettings');

module.exports = UserSettings;
