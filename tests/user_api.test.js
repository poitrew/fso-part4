/* eslint-disable no-undef */
const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')

const api = supertest(app)

describe('initialize only 1 root account', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('abcdef', 10) 
        const rootUser = new User({
            username: 'root',
            name: 'Daniel',
            passwordHash
        })
        await rootUser.save()
    })

    test('successfully created a new user account', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'anhharry2405',
            name: 'Debater',
            password: 'abcdef'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
        expect(usersAtEnd.map(user => user.username)).toContain(newUser.username)
    })

    test('existing username is not created and response appropriate status code', async () => {
        const usersAtStart = await helper.usersInDb()

        const existingUser = {
            username: 'root',
            name: 'Debater',
            password: 'abcdef'
        }

        const { body } = await api
            .post('/api/users')
            .send(existingUser)
            .expect(400)
            .expect('Content-type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
        expect(body.error).toBe('username must be unique')
    })

    test('invalid user is not created and response appropriate status code', async () => {
        const usersAtStart = await helper.usersInDb()

        const existingUser = {
            username: 'newaccount',
            password: 'abcdef'
        }

        const { body } = await api
            .post('/api/users')
            .send(existingUser)
            .expect(400)
            .expect('Content-type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
        expect(body.error).toContain('required')
    })

    test('user with invalid password is not created and response appropriate status code', async () => {
        const usersAtStart = await helper.usersInDb()

        const existingUser = {
            username: 'newaccount',
            name: 'Daniel',
            password: 'abc'
        }

        const { body } = await api
            .post('/api/users')
            .send(existingUser)
            .expect(400)
            .expect('Content-type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
        expect(body.error).toContain('password must have a minimum length of 4 char')
    })
})

afterAll(() => {
    mongoose.connection.close()
})