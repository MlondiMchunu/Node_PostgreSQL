const userRouter = require('express').Router()
const pools = require('../models/users')
const jwt = require('jsonwebtoken')
require('dotenv').config()


userRouter.get('/', async (req, res) => {
    res.send('<h1>Welcome to Home Page</h1> <p>THis is the Home Page of CRUD API</p>')
})

userRouter.get('/get_users', async (req, res) => {


    try {
        const query1 = 'SELECT * FROM users';
        const result = await pools.query(query1)

        res.json(result.rows)

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
            res.status(401).json({error:"check username and password match"})
        } else {
            console.log(user.rows)
            res.status(200).json(user.rows)
        }


        const userForToken = {
            username: user.username,
            id: user.id
        }

        const token = jwt.sign(
            userForToken,
            process.env.SECRET,
            {expiresIn: 60*60}
        )
        if (!token) {
            throw new Error("Token generation failed")
        }

        console.log("Token : ",token)

    } catch (error) {
        res.json(error)
        console.log(error)
    }
})

//limit deletion of users by only authorized users
const getTokenFrom = req =>{
    const authorization = req.get('authorization')
    if(authorization && authorization.startsWith('Bearer')){
        return authorization.replace('Bearer ','')
    }
    return null
}


userRouter.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id

        const decodedToken = jwt.verify(getTokenFrom(req),process.env.SECRET)
        if(!decodedToken.iat){
            res.status(401).json({error:"Invalid token"})
            console.log("invalid token")
        }
        //console.log(decodedToken)

        const query = 'DELETE FROM users WHERE id = $1 RETURNING *'
        const values = [id]
        const result = await pools.query(query, values)

        res.json({  message: 'User deleted succesfully!' })
        //res.json(result.rows)

    } catch (err) {
        //console.error(err)
        
        res.status(500).json({ error: err })
        console.error("User not allowed to perform operation")
    }
})

module.exports = userRouter

