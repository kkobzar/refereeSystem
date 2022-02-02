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

        await db.query('DELETE FROM habits WHERE id = ?',habitId)
    },
    async getHabit(habitId = 0){
        if (!habitId){
            throw ApiError.BadRequest('Bad habit id')
        }

        const [r,f] = await db.query("SELECT * FROM habits WHERE id = ?",habitId)

        if (!r.length){
            return false
        }
        return r[0]
    }
}

module.exports = habitService
