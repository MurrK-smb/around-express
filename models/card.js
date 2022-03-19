const mongoose = require('mongoose')
const validator = require('validator')

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The "name" field must be filled in'],
    minlength: [2, 'Name must contain at least 2 characters'],
    maxlength: [30, 'Name must contain at most 30 characters'],
  },
  link: {
    type: String,
    required: [true, 'The "link" field must be filled in'],
    validate: {
      validator: (value) => validator(value),
      message: 'the "link" field must conatain a valid URL',
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
  },
  likes: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);