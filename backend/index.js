const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL)

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


app.get('/api/flats', async (req, res) => {
  const flats = await sequelize.query("SELECT * FROM pisos LIMIT 10", { type: QueryTypes.SELECT })
  res.json(flats)
})

// const generateId = () => {
//   const maxId = flats.length > 0
//     ? Math.max(...flats.map(n => n.id))
//     : 0
//   return maxId + 1
// }

// app.post('/api/flats', (request, response) => {
//   const body = request.body

//   if (!body.content) {
//     return response.status(400).json({ 
//       error: 'content missing' 
//     })
//   }

//   const flat = {
//     content: body.content,
//     important: body.important || false,
//     date: new Date(),
//     id: generateId(),
//   }

//   flats = flats.concat(flat)

//   response.json(flat)
// })

// app.get('/api/flats/:id', (request, response) => {
//   const id = request.params.id
//   const flat = flats.find(flat => flat.id === id)

//   if (flat) {
//     response.json(flat)
//   } else {
//     response.status(404).end()
//   }

//   response.json(flat)
// })

// app.delete('/api/flats/:id', (request, response) => {
//   const id = request.params.id
//   flats = flats.filter(flat => flat.id !== id)

//   response.status(204).end()
// })

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})