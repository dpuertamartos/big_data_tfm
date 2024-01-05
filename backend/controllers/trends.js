const router = require('express').Router()
const { sequelize, select } = require('../util/db')

const getAggregatedData = async (options) => {
    let whereClause = ''
    const conditions = []

    if (options.city) {
        conditions.push(`city_group = '${options.city}'`)
    }
    if (options.type) {
        conditions.push(`type_group = '${options.type}'`)
    }
    if (options.active) {
        conditions.push(`active_group = '${options.active}'`)
    }
    if (options.month) {
        conditions.push(`updated_month_group = '${options.month}'`)
    }

    if (conditions.length > 0) {
        whereClause = 'WHERE ' + conditions.join(' AND ')
    }

    const query = `SELECT * FROM pisos_dw ${whereClause}`
    return await sequelize.query(query, { type: select })
}

router.get('/', async (req, res) => {
    try {
        const { city, type, active, month } = req.query
        const options = { city, type, active, month }
        const data = await getAggregatedData(options)
        res.json(data)
    } catch (error) {
        console.error('Error fetching filtered data:', error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

module.exports = router
