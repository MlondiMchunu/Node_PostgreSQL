const winesRouter = require('express').Router()
const pools = require('../models/db')
const jwt = require('jsonwebtoken')
require('dotenv').config()

winesRouter.get('/get_wines', async (req, res) => {
    try {

        const query = 'SELECT * FROM wines'
        const wines = await pools.query(query)
        res.json(wines)

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

module.exports = winesRouter