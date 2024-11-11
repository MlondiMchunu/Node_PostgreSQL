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

winesRouter.post('/wines', async (req, res) => {
    try {

        const { code, brand, location, id, year, price } = req.body
        const query = 'INSERT INTO wines(code, brand, location, id, year, price) values($1,$2,$3,$4,$5,$6) RETURNING *'
        const values = [code, brand, location, id, year, price]

        const wine = await pools.query(query,values)

        res.json(wine.rows)
        console.log("New wine added")

    } catch (err) {
        res.status(500).json({message:"wine could not be added"})
        console.error(err)
    }
})

module.exports = winesRouter