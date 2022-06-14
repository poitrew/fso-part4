const dummy = (blogs) => {
    return 1;
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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}