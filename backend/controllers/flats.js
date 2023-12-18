const router = require('express').Router()
const { sequelize, select } = require('../util/db')

const getFlats = async (flatNumber) => {
    return await sequelize.query(
        `SELECT * 
         FROM pisos 
         WHERE active = 1 
         LIMIT :flatNumber`,
        {
            type: select,
            replacements: { flatNumber: flatNumber }
        }
    )
}

const getBestFlats = async () => {
    return await sequelize.query(
        `SELECT * 
         FROM pisos 
         WHERE rating IS NOT NULL AND active = 1 
         ORDER BY rating ASC 
         LIMIT 20`,
        { type: select }
    )
}

const getBestFlatsByCity = async (city) => {
    return await sequelize.query(
        `SELECT * 
         FROM pisos 
         WHERE city = :city AND rating IS NOT NULL AND active = 1 
         ORDER BY rating ASC 
         LIMIT 20`,
        {
            type: select,
            replacements: { city: city }
        }
    )
}

router.get('/', async (req, res) => {
    const flats = await getFlats(10)
    res.json(flats)
})

router.get('/best_rating', async (req, res) => {
    const best_flats = await getBestFlats()
    res.json(best_flats)
})

router.get('/best_rating/:city', async (req, res) => {
    const city = req.params.city
    const best_flats_per_city = await getBestFlatsByCity(city)
    res.json(best_flats_per_city)
})

module.exports = router