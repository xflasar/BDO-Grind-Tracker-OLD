const express = require('express')
const router = express.Router()
const sessionController = require('../controllers/session.controller')
const { verifyToken } = require('../middlewares/authJwt')

router.get('/', [verifyToken], sessionController.GetSessionsData)
router.get('/sites', [verifyToken], sessionController.GetSessionSites)
router.post('/addsession', [verifyToken], sessionController.AddSession)
router.post('/editsession', [verifyToken], sessionController.EditSession)
router.post('/deletesession', [verifyToken], sessionController.DeleteSession)

module.exports = router
