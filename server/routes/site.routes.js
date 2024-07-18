const express = require('express')
const router = express.Router()
const siteController = require('../controllers/site.controller')
const { verifyToken } = require('../middlewares/authJwt')

router.get('/getaddsessionsites', [verifyToken], siteController.GetAddSessionSites)
router.get('/getitemdata/:siteId', [verifyToken], siteController.GetAddSessionSitesItemData)
router.get('/', [verifyToken], siteController.GetSiteData)
router.post('/modifysite', [verifyToken], siteController.ModifySite)

module.exports = router
