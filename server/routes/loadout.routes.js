const express = require('express')
const router = express.Router()
const loadoutController = require('../controllers/loadout.controller')
const { verifyToken } = require('../middlewares/authJwt')

router.get('/getloadouts', [verifyToken], loadoutController.GetUserLoadouts)
router.post('/addloadout', [verifyToken], loadoutController.AddUserLoadout)
router.patch('/updateloadout', [verifyToken], loadoutController.UpdateUserLoadout)
router.delete('/deleteloadout', [verifyToken], loadoutController.DeleteUserLoadout)

module.exports = router
