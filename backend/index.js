const app = require('./app') // the actual Express application
const config = require('./util/config')
const logger = require('./util/logger')

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})

