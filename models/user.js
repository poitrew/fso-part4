const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3
    },
    name: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
        delete returnedObj.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User