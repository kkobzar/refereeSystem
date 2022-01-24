const router = require('express').Router()
const userController = require('../controllers/userController')
const {body,checkSchema} = require('express-validator')
//TODO: Proper argument validation
const regValidation = checkSchema({
    email:{
        isEmail(options) {
        },
        isEmpty:{
            negated:true,
            errorMessage:'Email field should not be empty'
        }
    }
})

router.post('/register',body('email').not().isEmpty().isEmail(),
    body('password').isLength({min:5}),userController.register)
router.post('/login',body('email').not().isEmpty().isEmail(),body('password').not().isEmpty(),userController.login)
router.post('/logout',userController.logout)

router.get('/activate/:link',userController.activate)
router.get('/refresh',userController.refresh)

module.exports = router
