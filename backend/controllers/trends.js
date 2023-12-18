const router = require('express').Router()
const { sequelize, select } = require('../util/db')

const getAvgPrice = async () => {
    return await sequelize.query(
        `SELECT 
                AVG(price_euro) AS average_price, 
                AVG(superficie_util_m2) AS average_square_meters, 
                AVG(habitaciones) AS average_habs, 
                COUNT(*) AS total_listings, 
                strftime('%Y-%m', datetime(createdat, 'unixepoch')) AS month_year
        FROM pisos 
        GROUP BY month_year
        ORDER BY month_year DESC`,
        { type: select }
    )
}

const getTrendsByCity = async (city) => {
    return await sequelize.query(
        `SELECT city, 
                AVG(price_euro) AS average_price, 
                AVG(superficie_util_m2) AS average_square_meters, 
                AVG(habitaciones) AS average_habs, 
                COUNT(*) AS total_listings, 
                strftime('%Y-%m', datetime(createdat, 'unixepoch')) AS month_year
         FROM pisos 
         WHERE city = :city 
         GROUP BY city, month_year
         ORDER BY month_year DESC`,
        {
            type: select,
            replacements: { city: city }
        }
    )
}

const getTrendsByCitySqMax = async (city, sqmax) => {
    return await sequelize.query(
        `SELECT city, 
                AVG(price_euro) AS average_price, 
                AVG(superficie_util_m2) AS average_square_meters, 
                AVG(habitaciones) AS average_habs, 
                COUNT(*) AS total_listings, 
                strftime('%Y-%m', datetime(createdat, 'unixepoch')) AS month_year
         FROM pisos 
         WHERE city = :city AND superficie_util_m2 <= :sqmax
         GROUP BY city, month_year
         ORDER BY month_year DESC`,
        {
            type: select,
            replacements: {
                city: city,
                sqmax: sqmax
            }
        }
    )
}

router.get('/', async (req, res) => {
    const avg = await getAvgPrice()
    res.json(avg)
})

router.get('/:city', async (req, res) => {
    const city = req.params.city
    const trends = await getTrendsByCity(city)
    res.json(trends)
})

router.get('/:city/:m2', async (req, res) => {
    const m2 = Number(req.params.m2)
    const city = req.params.city
    const trends = await getTrendsByCitySqMax(city, m2)
    res.json(trends)
})


module.exports = router