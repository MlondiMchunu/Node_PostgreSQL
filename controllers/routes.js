const userRouter = require('express').Router()
const pools = require('../models/users')
const jwt = require('jsonwebtoken')
require('dotenv').config()


userRouter.get('/', async (req, res) => {
    res.send('<h1>Welcome to Home Page</h1> <p>THis is the Home Page of CRUD API</p>')
})

userRouter.get('/get_users/:id', async (req, res) => {

    //const userId = req.params.

    try {

        const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
        if (!decodedToken.iat) {
            res.status(401).json({ error: "Invalid token" })
            console.log("invalid token")
        }

        const userId = req.params.id
        // console.log("this is the request",req)

        const query1 = 'SELECT * FROM users'

        const query2 = 'SELECT * FROM users WHERE role = $1'
        const values = [userId]

        const user = await pools.query(query1)

        const admin = await pools.query(query2, values)

        //console.log(user.rows)
        //if(user.oid)
        console.log(userId)

        const rows = user.rows

        const roles = []
        rows.forEach(row => {
            //console.log('Name:', row.name)
            roles.push(row)
        })
        

        if (rows.role === 0) {
            res.json(user.rows)
        } else {
            res.json({ message: "cannot access router" })
        }
        /* if (admin.rowCount === 2) {
             res.json(user.rows)
         } else {
             res.json({ message: "cannot access resource" })
         }*/

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'An error occurred' })
    }

})

userRouter.put('/users/:id', async (req, res) => {
    try {
        const { name, email } = req.body
        const id = req.params.id

        const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *'
        const values = [name, email, id]
        const result = await pools.query(query, values)

        res.json(result.rows[0])

    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: ' An error occurred!!' })
    }
})

userRouter.post('/users', async (req, res) => {

    try {
        const { name, email } = req.body

        const query1 = 'INSERT INTO users(name,email) VALUES($1, $2) RETURNING *'
        const values = [name, email]
        const result = await pools.query(query1, values)

        res.json(result.rows)

    } catch (err) {
        console.error(err)

        res.status(500).json({ error: 'An error occurred' })

    }
})

userRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        const query = 'SELECT username, password FROM users WHERE username = $1 and password = $2'
        const values = [username, password]
        const user = await pools.query(query, values)


        if (user.rowCount == 0) {
            console.log("check username and password match")
            res.status(401).json({ error: "check username and password match" })
        } else {
            console.log(user.rows)
            //res.status(200).json(user.rows)
        }

        const userForToken = {
            username: user.username,
            id: user.id
        }

        const token = jwt.sign(
            userForToken,
            process.env.SECRET,
            { expiresIn: 60 * 60 }
        )
        if (!token) {
            throw new Error("Token generation failed")
        }

        res.cookie('t', token, { expire: new Date() + 9999 })

        console.log("Token : ", token)
        //console.log(cookie)

    } catch (error) {
        console.log(error)
        res.json(error)
    }
})

//limit deletion of users by only authorized users
const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.startsWith('Bearer')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}


userRouter.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id

        const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
        if (!decodedToken.iat) {
            res.status(401).json({ error: "Invalid token" })
            console.log("invalid token")
        }
        //console.log(decodedToken)

        const query = 'DELETE FROM users WHERE id = $1 RETURNING *'
        const values = [id]
        const result = await pools.query(query, values)

        res.json({ message: 'User deleted succesfully!' })
        //res.json(result.rows)

    } catch (err) {
        //console.error(err)

        res.status(500).json({ error: err })
        console.error("User not allowed to perform operation")
    }
})

userRouter.get('/signout', (req, res) => {
    try {
        res.clearCookie('t')
        res.json("Signed out")

        //console.log(res)
    } catch (err) {
        res.json(err)
        console.error(err)
    }
})

module.exports = userRouter

