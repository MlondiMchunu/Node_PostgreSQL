const express = require('express')
const morgan = require('morgan')
const userRouter = require('./controllers/users')
const winesRouter = require('./controllers/wines')

const app = express()

app.use(express.json())
app.use(morgan('dev'))

app.use('/',userRouter);
app.use('/users',userRouter)
app.use('/',winesRouter)

module.exports = app