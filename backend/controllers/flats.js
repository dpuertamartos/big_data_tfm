const router = require('express').Router()
const { sequelize, select } = require('../util/db')

const getFlats = async (options) => {
    const {
        columns = '*',
        limitNumber = 100,
        orderBy = 'id ASC',
        active = 1,
        province = null,
        type = null,
        minPrice = null,
        maxPrice = null,
        minHabitaciones = null,
        maxHabitaciones = null,
        minM2 = null,
        maxM2 = null,
        minRating = null,
        maxRating = null
    } = options

    let query = `SELECT ${columns} FROM pisos WHERE active = :active`
    let replacements = { active }

    if (province) {
        query += ` AND province = :province`
        replacements.province = province
    }

    if (type) {
        query += ` AND type = :type`
        replacements.type = type
    }

    if (minPrice !== null) {
        query += ` AND price_euro >= :minPrice`
        replacements.minPrice = minPrice
    }

    if (maxPrice !== null) {
        query += ` AND price_euro <= :maxPrice`
        replacements.maxPrice = maxPrice
    }

    // Add logic for habitaciones, m2, and rating
    if (minHabitaciones !== null) {
        query += ` AND habitaciones >= :minHabitaciones`
        replacements.minHabitaciones = minHabitaciones
    }

    if (maxHabitaciones !== null) {
        query += ` AND habitaciones <= :maxHabitaciones`
        replacements.maxHabitaciones = maxHabitaciones
    }

    if (minM2 !== null) {
        query += ` AND superficie_util_m2 >= :minM2`
        replacements.minM2 = minM2
    }

    if (maxM2 !== null) {
        query += ` AND superficie_util_m2 <= :maxM2`
        replacements.maxM2 = maxM2
    }

    if (minRating !== null) {
        query += ` AND rating >= :minRating`
        replacements.minRating = minRating
    }

    if (maxRating !== null) {
        query += ` AND rating <= :maxRating`
        replacements.maxRating = maxRating
    }

    query += ` ORDER BY ${orderBy}`

    // Only add LIMIT clause and replacement if noLimit is not true
    if (!options.noLimit) {
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

router.get('/province/:provinceName', async (req, res) => {
    try {
        const provinceName = req.params.provinceName
        const flats = await getFlats({ province: provinceName, noLimit: true }) // Adjust limitNumber as needed

        if (flats.length === 0) {
            return res.status(404).json({ message: 'No flats found in this province' })
        }

        res.json(flats)
    } catch (error) {
        console.error('Error fetching flats:', error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.get('/filtered', async (req, res) => {
    try {
        const { province, type, price_euro, habitaciones, m2, rating, orderBy, minRating, limitNumber } = req.query
        let [minPrice, maxPrice] = price_euro ? price_euro.map(Number) : [0, null]
        let [minHabitaciones, maxHabitaciones] = habitaciones ? habitaciones.map(Number) : [null, null]
        let [minM2, maxM2] = m2 ? m2.map(Number) : [null, null]
        let [minRatingValue, maxRatingValue] = rating ? rating.map(Number) : [null, null]

        // Determine the sort order
        let sort = orderBy || 'id ASC'

        let options = {
            province,
            type,
            minPrice,
            maxPrice,
            minHabitaciones,
            maxHabitaciones,
            minM2,
            maxM2,
            minRating: minRatingValue || minRating,
            maxRating: maxRatingValue,
            orderBy: sort,
            columns: 'id, price_euro, title, rating, habitaciones, superficie_util_m2, type, province',
            limitNumber
        }

        const flats = await getFlats(options)
        res.json(flats)
    } catch (error) {
        console.error('Error fetching filtered flats:', error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

module.exports = router