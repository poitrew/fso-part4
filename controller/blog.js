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

blogRouter.delete('/:id', async (req, res) => {
	await Blog.findByIdAndRemove(req.params.id)
	res.status(204).end()
})

blogRouter.put('/:id', async (req, res) => {
	const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {new: true})
	res.json(updatedBlog)
})

module.exports = blogRouter