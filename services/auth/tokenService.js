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
        const [r,f] = await db.query('SELECT * FROM tokens WHERE userId=?',[userId])
            .catch(e=>console.error(e))

        if (r.length > 0){
            await db.query(`UPDATE tokens SET userToken = '${refreshToken}' WHERE userId=${userId}`).catch(e=>console.error(e))
        }else {
            await db.query(`INSERT INTO tokens (userId,userToken) VALUES (${userId},'${refreshToken}')`).catch(e=>console.error(e))
        }

    },
    async removeToken(refreshToken){
        const [r,f] = await db.query('DELETE FROM tokens WHERE userToken = ?',refreshToken)
        return r;
    },
    validateRefreshToken(token){
        try {
            return jwt.verify(token,process.env.JWT_REFRESH_SECRET)
        }catch (e) {
            return null
        }
    },
    validateAccessToken(token){
        try {
            return jwt.verify(token,process.env.JWT_ACCESS_SECRET)
        }catch (e) {
            return null
        }
    },
    async findToken(token){
        const [r,f] = await db.query('SELECT * FROM tokens WHERE userToken = ?',token)
        console.log(r)
        return r;
    }

}

module.exports = tokenService
