const User = require('../models/user')

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'An error occurred'}))
}

const getUser = (req, res) => {
  const { id } = req.params
  User.findById(id)
    .orFail(() => {
      const error = new Error('User Id not found')
      error.statusCode = 404
      throw error
    })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid user Id'})
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message })
      } else {
        res.status(500).send({ message: 'An error has occurred on the server'})
      }
    })
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`
        })
      }
      else {
        res.status(500).send({ message: 'An error has occurred on the server'})
      }
    })
}

const updateUserInfo = (id, body, res) => {
  User.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error('User Id not found')
      error.statusCode = 404
      throw error
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'Validation Error') {
        res.status(403).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`})
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid user Id'})
      } else {
        res.status(500).send({ message: 'An error has occurred on the server' })
      }
    })
}

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body
  const id = req.user._id
  User.findByIdAndUpdate(id, { avatar }, { new: true })
    .orFail(() => {
      const error = new Error('Avatar Id not found')
      error.statusCode = 404
      throw error
    })
    .then((user) => {
      console.error();
      if (!user) {
        throw error;
      } else {
        res.status(201).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(404).send({ message: 'Id not found' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid Id' });
      } else {
        res.status(500).send({ message: 'An error has occurred on the server' });
      }
    })
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar
}