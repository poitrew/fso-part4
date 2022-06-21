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

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
        expect(usersAtEnd.map(user => user.username)).toContain(newUser.username)
    })
})