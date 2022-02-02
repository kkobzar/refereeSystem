const {db} = require('../../db')
const ApiError = require('../../exceptions/apiError')

const habitService = {
    async addHabit(userId = 0, title = null, question = ""){
        if (!userId){
            throw ApiError.UnauthorizedError()
        }
        if (!title){
            throw ApiError.BadRequest('Title must be provided')
        }

        await db.query('INSERT INTO habits SET ?', {userId,title,question})
    },
    async removeHabit(habitId = 0){
        if (!habitId){
            throw ApiError.BadRequest('Bad habit id')
        }
    }
}

module.exports = habitService
