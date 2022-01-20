const {db} = require('../../db')
const bcrypt = require('bcrypt')
const uuid = require('uuid')


const UserService = {
    async register(name,surname,password,email){
        let isRegistered = false

        //hash password
        const hashedPwd = await bcrypt.hash(password,parseInt(process.env.HASH_SALT))

        const time = new Date()

        //generate activation id
        const activationId = uuid.v4()

        //write new user to db
        await db.query('INSERT INTO users SET ?',{name,surname,email,password:hashedPwd,
            registred_time:`${time.toJSON().slice(0,10).replace(/-/g,'-')} ${time.toLocaleTimeString('it-IT')}`,
            activationId})
            .then(()=>{
                isRegistered = true
            }).catch(e=>console.error(e))

        return isRegistered
    },
    async activate(activationId){
        //find user with activation id
        const user = await db.query('SELECT * FROM users WHERE activationId = ?',activationId)
            .then(([row,fields])=>{
                if (row.length > 0){
                    db.query('UPDATE users SET activated = 1 WHERE activationId = ?',activationId)
                }
            })
    },
    isEmailRegistered(email){
        return new Promise((resolve, reject) => {
            db.query(`SELECT email FROM users WHERE email = '${email}'`)
                .then(([row,fields])=>{
                    if (row.length > 0){
                        resolve(true)
                    }else {
                        resolve(false)
                    }
                }).catch(e=>reject(e))
        })
    }
}

module.exports = UserService
