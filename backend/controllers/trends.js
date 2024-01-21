const router = require('express').Router()
const { sequelize, select } = require('../util/db')

const getAggregatedData = async (options) => {
    let whereClause = ''
    const conditions = []

    if (options.province) {
        conditions.push(`province_group = '${options.province}'`)
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
    if (options.isCapital) {
        conditions.push(`capital_group = '${options.isCapital}'`)
    }

    if (conditions.length > 0) {
        whereClause = 'WHERE ' + conditions.join(' AND ')
    }

    const query = `SELECT * FROM pisos_dw ${whereClause}`
    return await sequelize.query(query, { type: select })
}

router.get('/', async (req, res) => {
    try {
        const { province, type, active, month, isCapital } = req.query
        const options = { province, type, active, month, isCapital }
        const data = await getAggregatedData(options)
        res.json(data)
    } catch (error) {
        console.error('Error fetching filtered data:', error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

module.exports = router
