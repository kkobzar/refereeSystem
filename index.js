require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const {db} = require('./db')

const PORT = process.env.PORT || 3000


const app = express()

/*
middleware
*/
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/api/auth',require('./router/auth'))


;(function startServer() {
    db.query('SELECT * FROM users',(err,res)=>{
        if (err){
            console.error(err)
        }else {
            console.log(res)
        }
    })
    try {
        //start server
        app.listen(PORT,()=>{
            console.log(`server is running on port ${PORT}`)
        })

    }catch (e) {
        console.error(e)
    }
})();

