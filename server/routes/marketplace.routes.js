const express = require('express')
const router = express.Router()
const marketplaceController = require('../controllers/marketplace.controller')
const { verifyToken } = require('../middlewares/authJwt')
const { redisCacheMiddleware } = require('../middlewares/redis')

router.get('/queue', [verifyToken], marketplaceController.GetMarketplaceData)
router.post('/', [verifyToken], redisCacheMiddleware(), marketplaceController.GetMarketplaceData)

module.exports = router
