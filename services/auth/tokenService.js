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
        db.query('SELECT * FROM tokens WHERE userId=?',[userId],(err,res)=>{
            if (err){
                console.error(err)
            }else {
                //if token exist for user, rewrite
                if (res.length > 0){
                    db.query(`UPDATE tokens SET userToken=${refreshToken} WHERE userId=${userId}`,(err,rsl)=>{
                        if (err){
                            console.error(err)
                        }else {

                        }
                    })
                }else {
                    db.query(`INSERT INTO tokens (userId,userToken) VALUES (${userId},${refreshToken})`)
                }
            }
        })
    }
}

module.exports = tokenService
