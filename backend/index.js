const express = require('express')
const cors = require('cors')
const app = express()

const { PORT } = require('./util/config') 
const { connectToDatabase } = require('./util/db') 

const flatsRouter = require('./controllers/flats')


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/api/flats', flatsRouter)

app.use(unknownEndpoint)

const start = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
}

start()

