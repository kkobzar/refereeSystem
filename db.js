const mysql2 = require('mysql2')

const db = {
    db: mysql2.createPool({
        host: process.env["DB_HOST"],
        user: process.env["DB_USER"],
        password: process.env["DB_PWD"],
        database: process.env["DB_NAME"],
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }).promise(),
    isConnected: new Promise((resolve, reject) => {
        const con = mysql2.createConnection({
            host: process.env["DB_HOST"],
            user: process.env["DB_USER"],
            password: process.env["DB_PWD"],
            database: process.env["DB_NAME"]
        })
        con.connect(err => {
            if (err){
                reject(err)
            }else {
                con.destroy()
                resolve(true)
            }
        })
    })
}

module.exports = db
