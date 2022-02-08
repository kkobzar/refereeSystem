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

        const [r,f] = await db.query('INSERT INTO habits SET ?', {userId,title,question})

        const [row,fl] = await db.query("SELECT * FROM habits WHERE id = ?",r.insertId)
        return row[0]
    },
    async removeHabit(habitId = 0){
        if (!habitId){
            throw ApiError.BadRequest('Invalid habit id')
        }

        await db.query('DELETE FROM habits WHERE id = ?',habitId)
    },
    async editHabit(habitId= 0, title = null, question = null){
        if (!habitId){
            throw ApiError.BadRequest('Invalid habit id')
        }

        const editData = {}
        if (title){
            editData.title = title
        }
        if (question){
            editData.question = question
        }

        if (!Object.keys(editData).length){
            throw ApiError.BadRequest('No edit data provided!')
        }

        const [r,f] = await db.query("UPDATE habits SET ? WHERE id = ?", [editData,habitId])

        const [row,fl] = await db.query("SELECT * FROM habits WHERE id = ?",habitId)
        return row[0]
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
    async getUserHabits(userId = 0){
        if (!userId){
            throw ApiError.BadRequest('No user ID')
        }
        const [r,f] = await db.query("SELECT * FROM habits WHERE userId = ?", userId)

        if (r.length){
            return r;
        }else {
            return false;
        }
    },
    async getHabitsChecks(habitId = 0,userId = 0){
        if (!userId){
            throw ApiError.BadRequest('No user ID')
        }
        if (!habitId){
            throw ApiError.BadRequest('No habit ID')
        }

        const [r,f] = await db.query("SELECT checkDate FROM habitsChecks WHERE userId = ? AND habitId = ?",[userId,habitId])

        return r;
    }
}

module.exports = habitService
