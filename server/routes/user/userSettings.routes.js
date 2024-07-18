const express = require('express')
const router = express.Router()
const userSettingsController = require('../../controllers/user/userSettings.controller')
const { verifyToken } = require('../../middlewares/authJwt')

router.get('/', [verifyToken], userSettingsController.GetUserSettingsData)
router.post('/setdata', [verifyToken], userSettingsController.SetUserSettingsData)

module.exports = router
