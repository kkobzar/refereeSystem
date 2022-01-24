const router = require('express').Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/auth-middleware')


router.get('/users',authMiddleware,userController.getUsers)

module.exports = router
