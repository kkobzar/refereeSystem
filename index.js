require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const db = require('./db')
const errorMiddleware = require('./middleware/error-middleware')

const PORT = process.env.PORT || 3000


const app = express()

/*
middleware
*/
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(cors())
app.use('/api/auth',require('./router/auth'))
app.use(errorMiddleware)


;(function startServer() {
    db.isConnected.then(()=>{
        console.log('Connected to db')
        try {
            //start server if connected to db
            app.listen(PORT,()=>{
                console.log(`server is running on port ${PORT}`)
            })
        }catch (e) {
            console.error(e)
        }
    }).catch((err)=>{
        console.log('Cant connect to database')
        console.error(err)
    })
})();
