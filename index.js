const express = require('express')
const  {Pool}  = require('pg')
const morgan = require('morgan')

//create an instance of the express application
const app = express()
const port = 3000;

//PostgreSQL connection configuration
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'test',
    password: 'postgres',
    port:5432

})



//Middleware to pass JSON bodies
app.use(express.json())
app.use(morgan('dev'))

//Home page
app.get('/',(req,res)=>{
    res.send('<h1>Welcome to the Home Page </h1><p>This is the home page of the CRUD API.</p>')
})

//Start the server
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})

//Define routes for CRUD operations

//Create (POST)

app.post('/users',async(req,res)=>{
    try{
        const{name,email} = req.body;
        const query = 'INSERT INTO users (name,email) VALUES($1,$2) RETURNING *';
        const values = [name, email];
        const result = await pool.query(query, values);

        res.json(result.rows[0]);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'An error occurred'});
    }
});

//Read (GET)
app.get('/get_users',async(req,res)=>{
    try{
        const query = 'SELECT * FROM users';
        const result = await pool.query(query);

        res.json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).json({error:'An error occurred'});
    }
});

//Update (PUT)

app.put('/users/:id',async(req,res)=>{
    try{
        const id = req.params.id
        const {name, email} = req.body
        const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *'
        const values = [name, email, id]
        const result = await pool.query(query, values)

        res.json(result.rows[0])
    }catch(err){
        console.error(err)
        res.status(500).json({error: 'An error occurred'})
    }
})

//Delete (DELETE)
app.delete('/users/:id',async(req,res)=>{
    try{
        const id = req.params.id
        const query = 'DELETE FROM users WHERE id = $1'
        const result = await pool.query(query,[id])
        res.json({message: 'User deleted succesfully'})
    }catch(err){
        console.error(err)
        res.status(500).json({error: 'An error occurred'})
    }
})