const router = require('express').Router()
const { sequelize, select } = require('../util/db')


router.get('/', async (req, res, next) => {
    try {
        const flats = await sequelize.query('SELECT * FROM pisos LIMIT 100', { type: select })
        res.json(flats)
    }
    catch(exception) {
        next(exception)
    }
})

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

module.exports = router