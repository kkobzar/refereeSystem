const {db} = require('../../db')
const bcrypt = require('bcrypt')
const uuid = require('uuid')


const UserService = {
    async register(name,surname,password,email){
        //check if mail is in db
            let isRegistered = false
            //hash password
            const hashedPwd = await bcrypt.hash(password,process.env.HASH_SALT)
            const time = new Date()
            //generate activation id
            const activationId = uuid.v4()
            //write new user to db
            await db.query('INSERT INTO users SET ?',{name:name,surname:surname,email:email,password:hashedPwd,
                registred_time:`${time.toJSON().slice(0,10).replace(/-/g,'-')} ${time.toLocaleTimeString('it-IT')}`,
            activationId},(error,results)=>{
                if (error){
                    console.error(error)
                }else {
                    isRegistered = true
                }
            })

            return isRegistered
    },
    isEmailRegistered(email){
        return new Promise((resolve, reject) => {
            db.query('SELECT email FROM users WHERE email = ?', [email], async (error,results)=>{
                if (error){
                    console.error(error)
                    reject('db-error')
                }
                if (results.length > 0){
                    resolve(true)
                }else {
                    resolve(false)
                }
            })
        })
    }
}

module.exports = UserService
