const express = require('express')
const morgan = require('morgan')
const userRouter = require('./controllers/users')

const app = express()

app.use(express.json())
app.use(morgan('dev'))

app.use('/',userRouter);
app.use('/users',userRouter)

module.exports = app