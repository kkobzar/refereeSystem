const habitService = require('../services/core/habitService')
const tokenService = require('../services/auth/tokenService')
const ApiError = require('../exceptions/apiError')

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
    },
    async removeHabit(req,res,next){
        try{
            const {habitId} = req.body

            const token = req.headers.authorization.split(' ')[1]
            const userData = tokenService.validateAccessToken(token)

            //compare userId from token with habit userId in table
            const habit  = await habitService.getHabit(habitId)

            if (habit.userId !== userData.id){
                return next(ApiError.UnauthorizedError())
            }

            await habitService.removeHabit(habitId)

            res.sendStatus(200)
        }catch (e) {
            next(e)
        }
    },
    async checkHabit(req,res,next){
        try{

        }catch (e) {
            next(e)
        }
    }
}

module.exports = habitController
