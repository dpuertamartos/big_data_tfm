const express = require('express')
const cors = require('cors')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const { requestLogger, unknownEndpoint, errorHandler } = require('./util/middleware')

const flatsRouter = require('./controllers/flats')


app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/api/flats', flatsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app

