const userService = require('../services/auth/userService')
const UserController = {
    async register(req,res,next){
        const {name,surname,password,passwordConfirm,email} = req.body

        //check if fields are empty
        if (!name || !surname || !password || !passwordConfirm || !email){
            res.json({error:'All fields are mandatory'})
            return;
        }

        //check if passwords match
        if (password !== passwordConfirm){
            res.json({error:'Passwords should match'})
            return
        }

        //check if email is taken
        const registered = await userService.isEmailRegistered(email)
        if (registered){
            res.json({error:'Email is taken'})
            return
        }

        //register user
        const successfullyRegistered = await userService.register(name,surname,password,email)

        if (!successfullyRegistered){
            res.json({error:'Internal error occurred'})
        }else {
            res.sendStatus(201)
        }

    },
    async login(req,res,next){

    },
    async logout(req,res,next){

    },
    async activate(req,res,next){
        const {link} = req.params

        try {
            await userService.activate(link)
        }catch (e) {
            next(e)
        }
    },
    async refresh(req,res,next){
        try {
            res.json(['1','2'])
        }catch (e){
            console.error(e)
        }
    }
}

module.exports = UserController
