const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "The 'name' field must be filled in"],
      minlength: [2, 'Name must contain at least 2 characters'],
      maxlength: [30, 'Name must contain at most 30 characters'],
    },
    about: {
      type: String,
      required: [true, "The 'about' field must be filled in"],
      minlength: [2, 'About must contain at least 2 characters'],
      maxlength: [30, 'About must contain at most 30 characters'],
    },
    avatar: {
      type: String,
      required: [true, "The 'avatar' field must be filled in"],
      validator(link) {
        return validator.isURL(link);
      },
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
