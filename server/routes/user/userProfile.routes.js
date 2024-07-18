const express = require('express')
const router = express.Router()
const userProfileController = require('../../controllers/user/userProfile.controller')
const { verifyToken } = require('../../middlewares/authJwt')

router.get('/', [verifyToken], userProfileController.GetUserProfileData)
router.post('/setuserprofiledata', [verifyToken], userProfileController.SetUserProfileData)

module.exports = router
