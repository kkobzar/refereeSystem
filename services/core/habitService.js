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
            throw ApiError.BadRequest('Invalid habit id')
        }

        await db.query('DELETE FROM habits WHERE id = ?',habitId)
    },
    async getHabit(habitId = 0){
        if (!habitId){
            throw ApiError.BadRequest('Invalid habit id')
        }

        const [r,f] = await db.query("SELECT * FROM habits WHERE id = ?",habitId)

        if (!r.length){
            return false
        }
        return r[0]
    },
    async checkHabit(habitId = 0,date = null,userId = 0){
        if (!habitId){
            throw ApiError.BadRequest('Invalid habit id')
        }

        if (!date || !date instanceof Date){
            throw ApiError.BadRequest('Invalid date')
        }

        const formattedDate = date.toJSON().slice(0,10).replace(/-/g,'-')

        //find if habit is checked
        const [r,f] = await db.query("SELECT * FROM habitsChecks WHERE habitId = ? AND checkDate = ? AND userId = ?",[habitId,formattedDate,userId])

        if (r.length){
            await db.query("DELETE FROM habitsChecks WHERE habitId = ? AND checkDate = ? AND userId = ?", [habitId,formattedDate,userId])
        }else{
            await db.query("INSERT INTO habitsChecks SET ?", {habitId,checkDate:formattedDate,userId})
        }
    }
}

module.exports = habitService
