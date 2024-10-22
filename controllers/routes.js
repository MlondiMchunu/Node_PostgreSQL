const userRouter = require('express').Router()
const pools = require('../models/users')


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

userRouter.put('/users/:id',async(req,res)=>{
    try{
        const {name,email} = req.body
        const id = req.params.id

        const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *' 
        const values = [name, email, id]
        const result = await pools.query(query,values)

        res.json(result.rows[0])
        
    }
    catch(err){
        console.error(err)
        res.status(500).json({error:' An error occurred!!'})
    }
})

userRouter.post('/users',async(req,res)=>{
    
    try{
        const {name,email} = req.body

        const query1 = 'INSERT INTO users(name,email) VALUES($1, $2) RETURNING *'
        const values = [name, email]
        const result = await pools.query(query1,values)

        res.json(result.rows)

    }catch(err){
        console.error(err)

        res.status(500).json({error:'An error occurred'})

    }
})

userRouter.delete('/users/:id',async(req,res)=>{
    try{
        const id = req.params.id
        
        const query = 'DELETE FROM users WHERE id = $1 RETURNING *'
        const values = [id]
        const result = await pools.query(query,values)

        res.json({message: 'User deleted succesfully!'})
        res.json(result.rows)

    }catch(err){
        console.error(err)
        res.status(500).json({error:' An error occurred!!'})
    }
})

module.exports = userRouter

