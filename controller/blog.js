const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
	const result = await Blog.find({}).populate('user', { username: 1, name: 1 })
	res.json(result)
})

blogsRouter.post('/', async (req, res) => {
	const body = req.body
	if (!body.author || !body.title) {
		return res.status(400).end()
	}

	const users = await User.find({})
	const randomUser = users[Math.floor(Math.random() * users.length)]

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes || 0,
		user: randomUser._id
	})

	const savedBlog = await blog.save()

	randomUser.blogs = randomUser.blogs.concat(savedBlog._id)
	await randomUser.save()

	res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
	await Blog.findByIdAndRemove(req.params.id)
	res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
	const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {new: true})
	res.json(updatedBlog)
})

module.exports = blogsRouter