const express = require('express')
const router = express.Router()
const userSecurityController = require('../../controllers/user/userSecurity.controller')
const { verifyToken } = require('../../middlewares/authJwt')

router.post('/changepassword', [verifyToken], userSecurityController.SetUserSecurityData)

module.exports = router
