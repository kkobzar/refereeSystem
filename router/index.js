const router = require('express').Router()
const userController = require('../controllers/userController')
const habitController = require('../controllers/habitController')
const authMiddleware = require('../middleware/auth-middleware')


router.get('/users',authMiddleware,userController.getUsers)

router.post('/addHabit',authMiddleware,habitController.addHabit)
router.post('/editHabit',authMiddleware,habitController.editHabit)
router.delete('/removeHabit',authMiddleware,habitController.removeHabit)

router.post('/toggleHabit', authMiddleware,habitController.toggleHabit)

router.get('/userHabits',authMiddleware,habitController.getUserHabits)

router.get('/userHabitChecks',authMiddleware,habitController.getHabitsChecks)
module.exports = router
