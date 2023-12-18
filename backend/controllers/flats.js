const router = require('express').Router()
const { sequelize, select } = require('../util/db')

const getFlats = async (options) => {
    // Destructuring with default values
    const {
        columns = '*',
        limitNumber = 10,
        orderBy = 'id ASC', // Default ordering
        active = 1,
        city = null,
        rating = null
    } = options

    // Start building the query
    let query = `SELECT ${columns} FROM pisos WHERE active = :active`

    // Building replacements object
    let replacements = {
        active: active,
        limitNumber: limitNumber,
    }

    if (city) {
        query += ` AND city = :city`
        replacements.city = city
    }

    if (rating !== null) {
        query += ` AND rating IS NOT NULL`
    }

    query += ` ORDER BY ${orderBy} LIMIT :limitNumber`

    return await sequelize.query(query, {
        type: select,
        replacements: replacements
    })
}


router.get('/', async (req, res) => {
    const flats = await getFlats({ limitNumber: 10 })
    res.json(flats)
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

module.exports = router