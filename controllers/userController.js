const userService = require('../services/auth/userService')

const UserController = {
    async register(req,res,next){
        const {name,surname,password,passwordConfirm,email} = req.body
        try {
            //register user
            await userService.register(name,surname,password,passwordConfirm,email)
            res.sendStatus(201)
        }catch (e) {
            next(e)
        }

    },
    async login(req,res,next){
        try {
            const {email,password} = req.body
            const user = await userService.login(email,password)
            res.cookie('refreshToken',user.refreshToken,{maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.json(user)
        }catch (e){
            next(e)
        }
    },
    async logout(req,res,next){
        try {

        }catch (e) {
            next(e)
        }
    },
    async activate(req,res,next){
        const {link} = req.params
        try {
            await userService.activate(link)
            res.redirect(process.env.CLIENT_URL)
        }catch (e) {
            next(e)
        }
    },
    async refresh(req,res,next){
        try {
            res.json(['1','2'])
        }catch (e){
            next(e)
        }
    }
}

module.exports = UserController
