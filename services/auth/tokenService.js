const jwt = require('jsonwebtoken')
const {db} = require('../../db')

const tokenService = {
    generateToken(payload){
        const accessToken = jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{expiresIn: '45m'})
        const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    },
    async saveToken(userId, refreshToken){
        let tokenRegistered = false
        db.query('SELECT * FROM tokens WHERE userId=?',[userId])
            .then(([row,field])=>{
                //if token exist for user, rewrite
                if (row.length > 0){
                    tokenRegistered = true
                }
            })
            .catch(e=>console.error(e))

        if (tokenRegistered){
            await db.query(`UPDATE tokens SET userToken=${refreshToken} WHERE userId=${userId}`).catch(e=>console.error(e))
        }else {
            await db.query(`INSERT INTO tokens (userId,userToken) VALUES (${userId},${refreshToken})`).catch(e=>console.error(e))
        }

    }
}

module.exports = tokenService
