const mysql2 = require('mysql2')

module.exports.db = mysql2.createPool({
    host: process.env["DB_HOST"],
    user: process.env["DB_USER"],
    password: process.env["DB_PWD"],
    database: process.env["DB_NAME"],
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})
