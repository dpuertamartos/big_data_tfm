const router = require('express').Router()
const { sequelize, select } = require('../util/db')

const getFlats = async (options) => {
    const {
        columns = '*',
        limitNumber = 10,
        orderBy = 'id ASC',
        active = 1,
        city = null,
        rating = true,
        noLimit = false
    } = options

    let query = `SELECT ${columns} FROM pisos WHERE active = :active`

    let replacements = { active }

    if (city) {
        query += ` AND city = :city`
        replacements.city = city
    }

    if (rating !== null) {
        query += ` AND rating IS NOT NULL`
    }

    query += ` ORDER BY ${orderBy}`

    if (!noLimit) {
        query += ` LIMIT :limitNumber`
        replacements.limitNumber = limitNumber
    }

    return await sequelize.query(query, {
        type: select,
        replacements
    })
}

const getFlatById = async (id) => {
    const query = 'SELECT * FROM pisos WHERE id = :id'
    return await sequelize.query(query, {
        type: select,
        replacements: { id }
    })
}


router.get('/', async (req, res) => {
    const flats = await getFlats({ limitNumber: 100 })
    res.json(flats)
})

router.get('/unique/:id', async (req, res) => {
    try {
        const id = req.params.id
        const flat = await getFlatById(id)

        if (flat.length === 0) {
            return res.status(404).json({ message: 'Flat not found' })
        }

        res.json(flat[0])
    } catch (error) {
        console.error('Error fetching flat:', error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.get('/rating', async (req, res) => {
    const { city, minPrice, maxPrice, limitNumber, sorting } = req.query

    let options = {}

    let sort = 'ASC'
    if (sorting) {
        sort = sorting
    }
    if (city) options.city = city
    if (minPrice) options.minPrice = minPrice
    if (maxPrice) options.maxPrice = maxPrice
    if (limitNumber) options.limitNumber = limitNumber

    const best_flats = await getFlats({ ...options, orderBy: 'rating ' + sort, limitNumber: 10 })
    res.json(best_flats)
})

router.get('/city/:cityName', async (req, res) => {
    try {
        const cityName = req.params.cityName
        const flats = await getFlats({ city: cityName, noLimit: true }) // Adjust limitNumber as needed

        if (flats.length === 0) {
            return res.status(404).json({ message: 'No flats found in this city' })
        }

        res.json(flats)
    } catch (error) {
        console.error('Error fetching flats:', error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

module.exports = router