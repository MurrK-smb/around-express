const Card = require('../models/card')

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards}))
    .catch(() => res.status(500).send({ message: 'An error occurred' }))
}

const createCard = (req, res) => {
  const owner = req.user._id
  const { name, link } = req.body
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ data: card })
    })
    .catch((err) => {
      if (err.name === 'Validation Error') {
        res.status(400).send({ message: `${Object.values}`})
      } else {
        res.status(500).send({ message: 'An error has occurred'})
      }
    })
}

const deleteCard = (req, res) => {
  const { id } = req.params
  Card.findById(id)
    .orFail(() => {
      const error = new Error('No card found for the specified id')
      error.statusCode = 404
      throw error
    })
    .then((card) => Card.deleteOne(card))
      .then(() => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid card Id' })
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message})
      } else {
        res.status(500).send({ message: 'An error has occurred'})
      }
    })
}

const updateLike = (req, res, method) => {
  const { params: { id } } = req
  Card.findByIdAndUpdate(id, { [method]: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      const error = new Error('Id did not match existing card')
      error.statusCode = 404
      throw error
    })
    .then((card) => {
      res.send({ data: card })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid Id' })
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message })
      } else {
        res.status(500).send({ message: 'An error has occurred' })
      }
    })
}

const likeCard = (req, res) => updateLike(req, res, '$addToSet')

const dislikeCard = (req, res) => updateLike(req, res, '$pull')

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}
