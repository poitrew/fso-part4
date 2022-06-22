const _ = require('lodash')

const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    const likes = blogs.map(blog => blog.likes)
    const favBlog = blogs.find(blog => blog.likes === Math.max(...likes))
    return {
        title: favBlog.title,
        author: favBlog.author,
        likes: favBlog.likes
    }
}

const mostBlogs = (blogs) => {
    /* vanilla js version
        const authorsName = new Set(blogs.map(blog => blog.author))
        const authorStat = {}
        authorsName.forEach(author => {
            authorStat[author] = blogs.filter(blog => blog.author === author)
        })
        const authorBlogs = Object.keys(authorStat).map(author => ({
            author: author,
            blogs: authorStat[author].length
        }))
        let highest = 0
        for (let i = 0; i < authorBlogs.length; i++) {
            if (authorBlogs[i].blogs > highest) {
                highest = authorBlogs[i].blogs
            }
        }
        return authorBlogs.find(author => author.blogs === highest) 
    */
    const topAuthor = _.chain(blogs)
        .groupBy('author')
        .map((group, author) => ({
            author: author,
            blogs: group.length
        }))
        .maxBy((o) => o.blogs)
        .value()
    return topAuthor
}

const mostLikes = (blogs) => {
    const topLikes = _.chain(blogs)
        .groupBy('author')
        .map((group, author) => ({
            author: author,
            likes: group.reduce((total, blog) => total += blog.likes, 0)
        }))
        .maxBy((obj) => obj.likes)
        .value()
    return topLikes
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}