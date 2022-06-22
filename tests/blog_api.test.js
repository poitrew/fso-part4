/* eslint-disable no-undef */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('blog api returns a list of all blogs', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-type', /application\/json/)
})

test('a random blog in the list has the unique id property', async () => {
    const blogsInDb = await helper.blogsInDb()
    const result = blogsInDb[Math.floor(Math.random() * blogsInDb.length)]
    expect(result.id).toBeDefined()
})

test('successfully added a new blog to the database', async () => {
    const testBlog = {
        title: 'Forrest Grump is good',
        author: 'Daniel',
        url: 'http://instagram.com/',
        likes: 1
    }
    
    const res = await api
        .post('/api/blogs')
        .send(testBlog)
        .expect(201)
        .expect('Content-type', /application\/json/)
    
    const blogsInDb = await helper.blogsInDb()

    expect(blogsInDb).toHaveLength(helper.initialBlogs.length + 1)
    const newBlog = res.body
    expect(newBlog.title).toBe('Forrest Grump is good')
})

test('newly added blog without likes input will be default to 0', async () => {
    const testBlog = {
        title: 'Forrest Grump is good',
        author: 'Daniel',
        url: 'http://instagram.com/',
    }

    const res = await api
        .post('/api/blogs')
        .send(testBlog)
        .expect(201)
        .expect('Content-type', /application\/json/)
    
    expect(res.body.likes).toBe(0)
})

test('newly added blog without title or author will be response with status 400', async () => {
    const testBlog = {
        url: 'http://instagram.com/',
    }

    await api
        .post('/api/blogs')
        .send(testBlog)
        .expect(400)
})

test('deletetion of a blog', async () => {
    const blogsBeforeDel = await helper.blogsInDb()
    const blogToDel = blogsBeforeDel[0]

    await api
        .delete(`/api/blogs/${blogToDel.id}`)
        .expect(204)

    const blogsAfterDel = await helper.blogsInDb()
    expect(blogsAfterDel).toHaveLength(helper.initialBlogs.length - 1)
    
    const titles = blogsAfterDel.map(blog => blog.title)
    expect(titles).not.toContain(blogToDel.title)
})

test('update likes for an individual blog post', async () => {
    const blogsBeforeUpdate = await helper.blogsInDb()
    const blogToUpdate = blogsBeforeUpdate[0]

    const res = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ ...blogToUpdate, likes: 100 })
        .expect(200)
        .expect('Content-type', /application\/json/)

    const updatedBlog = res.body
    const blogsAfterUpdate = await helper.blogsInDb()
    expect(blogsAfterUpdate).toContainEqual(updatedBlog)
})

afterAll(() => {
    mongoose.connection.close()
})