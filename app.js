const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controller/blog')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

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

app.use('/api/blogs', blogRouter)

app.use(middleware.unknownEndpoint)

module.exports = app