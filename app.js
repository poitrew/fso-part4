const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

const loginRouter = require('./controller/login')
const usersRouter = require('./controller/user')
const blogsRouter = require('./controller/blog')

logger.info('Connecting to', config.mongoUrl)

mongoose.connect(config.mongoUrl)
    .then(() => {
        logger.info('Connected to MongoDB')
    })
    .catch((err) => {
        logger.error('Error when connecting to MongoDB:', err.message)
    })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use(middleware.tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)

app.use(middleware.errorHandler)

module.exports = app