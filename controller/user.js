const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
    res.json(users)
})

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body

    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return res.status(400).json({
            error: 'username must be unique'
        })
    }

    if (!password || password.length < 4) {
        return res.status(400).json({
            error: 'password must have a minimum length of 4 char'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
        username,
        name,
        passwordHash: passwordHash
    })

    const savedUser = await newUser.save()

    res.status(201).json(savedUser)
})

module.exports = usersRouter