const {db} = require('../../db')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const ApiError = require("../../exceptions/apiError");
const tokenService = require('./tokenService')
const userDto = require('../../dto/userDTO')
const {raw} = require("express");


const UserService = {
    async register(name,surname,password,passwordConfirm,email){
        //check if email is taken
        if (await this.isEmailRegistered(email)){
            throw ApiError.BadRequest('Email is taken')
        }

        //check if passwords match
        if (password !== passwordConfirm){
            throw ApiError.BadRequest('Passwords should match')
        }

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

        if (!isRegistered) {
            throw ApiError.ServerError()
        }

        //get new user info
        const [row,f] = await db.query('SELECT * FROM users WHERE email = ?',email)

        //generate token
        let payload = new userDto(row[0])
        const tokens = tokenService.generateToken({...payload})
        //save token
        await tokenService.saveToken(payload.id,tokens.refreshToken)

        return {
            ...tokens,
            user:payload
        }
    },
    async login(email,password){
        if (!email || !password){
            throw ApiError.BadRequest('No credentials')
        }
        const [row,f] = await db.query('SELECT * FROM users WHERE email = ?',email)
        if (row.length === 0){
            throw ApiError.BadRequest('No user with this email')
        }else {
            //check if passwords match
            if(await bcrypt.compare(password,row[0].password)){
                //generate token
                let payload = new userDto(row[0])
                const tokens = tokenService.generateToken({...payload})
                //save token
                await tokenService.saveToken(payload.id,tokens.refreshToken)
                return {...tokens, user: payload}
            }else {
                throw ApiError.BadRequest('Wrong password')
            }
        }
    },
    async logout(refreshToken){
        return  await tokenService.removeToken(refreshToken)
    },
    async activate(activationId){
        //find user with activation id
        const user = await db.query('SELECT * FROM users WHERE activationId = ?',activationId)
            .then(([row,fields])=>{
                if (row.length > 0){
                    db.query('UPDATE users SET isActivated = 1 WHERE activationId = ?',activationId)
                }
            })
    },
    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        }

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError()
        }

        const [user,f] = await db.query('SELECT * FROM users WHERE id = ?',userData.id)

        const userDTO = new userDto(user[0])

        const tokens = tokenService.generateToken({...userDTO})
        await tokenService.saveToken(userDTO.id,tokens.refreshToken)

        return{
            ...tokens,
            user:userDTO
        }
    },
    async getAllUsers(){
        const [r,f] = await db.query('SELECT * FROM users')
        const result = []
        r.forEach(i=>{
            const dto = new userDto(i)
            result.push(dto)
        })
        return result;
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
