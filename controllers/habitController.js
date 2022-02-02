const habitService = require('../services/core/habitService')
const tokenService = require('../services/auth/tokenService')

const habitController = {
    async addHabit(req,res,next){
        try{
            const {title, question} = req.body

            const token = req.headers.authorization.split(' ')[1]
            const userData = tokenService.validateAccessToken(token)

            await habitService.addHabit(userData.id, title, question)
            res.sendStatus(201)
        }catch (e) {
            next(e)
        }
    }
}

module.exports = habitController
