require('dotenv').config()
const { Pool } = require('pg')

const pswd = process.env.PASS
const port = process.env.PORT

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'test',
    password: pswd,
    port: port

})


const conn = async() => {
    try {
        await pool.connect()
        console.log("connected to database")
    } catch (error) {
        console.log(error)
    }
}
conn()

module.exports = pool