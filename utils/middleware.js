const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        req.token = authorization.substring(7)
    }
    
    next()
}

const userExtractor = async (req, res, next) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken.id) {
        res.status(401).json({ error: 'token missing or invalid' })
    }

    req.user = await User.findById(decodedToken.id)

    next()
}

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:', req.path)
    logger.info('Body:', req.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
    logger.error(error.message)
    
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } 
    if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'token is missing or invalid'})
    }
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'token is expired' })
    }
  
    next(error)
}

module.exports = {
    tokenExtractor,
    userExtractor,
    requestLogger,
    unknownEndpoint,
    errorHandler
}   