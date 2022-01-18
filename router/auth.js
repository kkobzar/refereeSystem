const router = require('express').Router()

router.post('/register')
router.post('/login')
router.post('/logout')
router.post('/activate/:link')
router.post('/refresh')

module.exports.auth = router
