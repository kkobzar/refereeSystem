const router = require('express').Router()
const userController = require('../controllers/userController')
const {body} = require('express-validator')

function registrationValidation() {
    body('email').isEmpty().isEmail()
    body('password').isEmpty().isLength({min:5})
    body('passwordConfirm').isEmpty().isLength({min:5})
    body('name').isEmpty().isLength({min:3})
    body('surname').isEmpty().isLength({min:3})
}

router.post('/register',registrationValidation,userController.register)
router.post('/login',userController.login)
router.post('/logout',userController.logout)

router.get('/activate/:link',userController.activate)
router.get('/refresh',userController.refresh)

module.exports = router
