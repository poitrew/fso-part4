const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (req, res) => {
	const result = await Blog.find({})
	res.json(result)
})

blogRouter.post('/', async (req, res) => {
	const body = req.body
	if (!body.author || !body.title) {
		return res.status(400).end()
	}

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes || 0
	})
	const savedBlog = await blog.save()
	res.status(201).json(savedBlog)
})

module.exports = blogRouter