require('dotenv').config()

module.exports = {
    DATABASE_URL: process.env.DATABASE_URL || 'sqlite:/usr/src/app/database/pisos.db',
    PORT: process.env.PORT || 3001,
}