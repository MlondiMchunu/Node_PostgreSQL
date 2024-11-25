const winesRouter = require('express').Router()
const pools = require('../models/db')
const jwt = require('jsonwebtoken')
require('dotenv').config()


winesRouter.get('/get_wines', async (req, res) => {
    try {

        const query = 'SELECT * FROM wines'
        const wines = await pools.query(query)
        res.json(wines.rows)

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

winesRouter.get('/get_wines/:id',async(req,res)=>{
	const id = req.params.id
	
	try{
		const query = 'SELECT * FROM wines WHERE id = $1'
		const values = [id]
		const wines = await pools.query(query,values)
		
		res.json(wines.rows)
		
	}catch(err){
		console.log(err)
		res.status(500).json(err)
	}
})

winesRouter.post('/wines', async (req, res) => {
    try {

        const { code, brand, location, id, year, price } = req.body
        const query = 'INSERT INTO wines(code, brand, location, id, year, price) values($1,$2,$3,$4,$5,$6) RETURNING *'
        const values = [code, brand, location, id, year, price]

        const wine = await pools.query(query, values)

        res.json(wine.rows)
        console.log("New wine added")

    } catch (err) {
        res.status(500).json({ message: "wine could not be added" })
        console.error(err)
    }
})

const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.startsWith('Bearer')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

winesRouter.delete('/wines/:id', async (req, res) => {

    try {
        const id = req.params.id
        console.log(id)

        const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
        if (!decodedToken.iat) {
            res.status(401).json({ error: "Invalid token" })
            console.log("Invalid token")
        }

        const query = 'DELETE FROM wines WHERE code = $1 RETURNING *'
        const values = [id]

        const wine = await pools.query(query, values)

        res.json({ message: "wine was deleted succesfully" })
        console.log(wine.rows, " deleted")
    }

    catch (err) {
        res.status(400).json(err)
        console.error(err)

    }
})

module.exports = winesRouter
