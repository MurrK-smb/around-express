const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The 'name' field must be filled in"],
    minlength: [2, "Name must contain at least 2 characters"],
    maxlength: [30, "Name must contain at most 30 characters"]
  },
  about: {
    type: String,
    required: [true, "The 'about' field must be filled in"],
    minlength: [2, "About must contain at least 2 characters"],
    maxlength: [30, "About must contain at most 30 characters"]
  },
  avatar: {
    type: String,
    required: [true, "The 'avatar' field must be filled in"],
    validate: {
      validator: (value) => value.test(/https?:\/\/.+/),
      message:  "The 'avatar' field must contain a valid URL"
    }
  }
}, { versionKey: false })

module.exports = mongoose.model('user', userSchema)