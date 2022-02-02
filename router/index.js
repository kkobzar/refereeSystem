const router = require('express').Router()
const userController = require('../controllers/userController')
const habitController = require('../controllers/habitController')
const authMiddleware = require('../middleware/auth-middleware')


router.get('/users',authMiddleware,userController.getUsers)

router.post('/addHabit',authMiddleware,habitController.addHabit)

module.exports = router
