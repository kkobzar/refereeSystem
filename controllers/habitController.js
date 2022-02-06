const habitService = require('../services/core/habitService')
const habitChecksService = require('../services/core/habitChecksService')
const tokenService = require('../services/auth/tokenService')
const ApiError = require('../exceptions/apiError')

const getUserInfo = (req)=>{
    const token = req.headers.authorization.split(' ')[1]
    return tokenService.validateAccessToken(token)
}

const habitController = {
    async addHabit(req,res,next){
        try{
            const {title, question} = req.body

            const userData = getUserInfo(req)

            const habit = await habitService.addHabit(userData.id, title, question)
            res.json(habit)
        }catch (e) {
            next(e)
        }
    },
    async removeHabit(req,res,next){
        try{
            const {habitId} = req.body

            //compare userId from token with habit userId in table
            const habit  = await habitService.getHabit(habitId)
            if(!habit){
                return next(ApiError.BadRequest('No habit with ID'))
            }
            const userData = getUserInfo(req)
            if (habit.userId !== userData.id){
                return next(ApiError.UnauthorizedError())
            }

            await habitService.removeHabit(habitId)

            res.sendStatus(200)
        }catch (e) {
            next(e)
        }
    },
    async editHabit(req,res,next){
        try{
            const {habitId,title,question} = req.body

            //compare userId from token with habit userId in table
            const habit  = await habitService.getHabit(habitId)

            if(!habit){
                return next(ApiError.BadRequest('No habit with ID'))
            }
            const userData = getUserInfo(req)
            if (habit.userId !== userData.id){
                return next(ApiError.UnauthorizedError())
            }

            await habitService.editHabit(habitId,title,question)
        }catch (e) {
            next(e)
        }
    },
    async toggleHabit(req,res,next){
        try{
            const {habitId,date} = req.body

            const habit  = await habitService.getHabit(habitId)
            if (!habit){
                return next(ApiError.BadRequest('Invalid habit Id'))
            }

            const userData = getUserInfo(req)

            await habitChecksService.checkHabit(habitId,new Date(date),userData.id)

            res.sendStatus(200)
        }catch (e) {
            next(e)
        }
    },
    async getUserHabits(req,res,next){
        try{
            const userData = getUserInfo(req)

            const habits = await habitService.getUserHabits(userData.id)

            res.json(habits)
        }catch (e) {
            next(e)
        }
    },
    async getHabitsChecks(req,res,next){
        try {
            const {habitId} = req.body

            const userData = getUserInfo(req)

            const checksDates = await habitService.getHabitsChecks(habitId,userData.id)

            res.json(checksDates)
        }catch (e) {
            next(e)
        }
    }
}

module.exports = habitController
