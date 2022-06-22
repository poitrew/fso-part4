const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
    const result = await Blog.find({}).populate('user', { username: 1, name: 1 })
    res.json(result)
})

// BLOG CREATION

blogsRouter.post('/', userExtractor, async (req, res) => {
    const body = req.body
    const user = req.user

    if (!body.author || !body.title) {
        return res.status(400).end()
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(savedBlog)
})

// BLOG DELETION

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
    const user = req.user
    const blog = await Blog.findById(req.params.id)

    if (user.id !== blog.user.toString()) {
        return res.status(401).json({ error: 'wrong user, wrong note' })
    }
    
    await blog.remove()
    user.blogs = user.blogs.filter(b => b.id !== blog.id)
    await user.save()

    res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.json(updatedBlog)
})

module.exports = blogsRouter