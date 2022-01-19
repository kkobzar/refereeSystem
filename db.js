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
    }),
    writeData(table,data){
        return new Promise((resolve, reject) => {
            let q = 'INSERT INTO ' + table + ' ('
            for (const d in data){
                q += d + ', '
            }
            //remove last coma
            q = q.slice(0,-2)
            q+=') VALUES ('
            for (const d in data){
                q += '?, '
            }
            //remove last coma
            q = q.slice(0,-2)
            q += ' )';
            let dataRows = []
            for (const d in data){
                dataRows.push(data[d])
            }
            console.log(q)
            console.log(dataRows)
            this.db.query(q, dataRows,(err,rsl)=>{
                if (err){
                    console.error(err)
                    reject(err)
                }else {
                    resolve(true)
                }
            })
        })
    }
}

module.exports = db
