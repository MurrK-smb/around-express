const Card = require('../models/card');
const {
  SUCCESS,
  CREATED_SUCCESS,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(SUCCESS).send({ data: cards }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error occurred' }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED_SUCCESS).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Data entered incorrectly' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'An error has occurred' });
    });
};

const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findById(id)
    .orFail(() => {
      const error = new Error('No card found for the specified id');
      error.statusCode = NOT_FOUND_ERROR;
      throw error;
    })
    .then((card) => Card.deleteOne(card))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid card Id' });
      } else if (err.statusCode === NOT_FOUND_ERROR) {
        res.status(NOT_FOUND_ERROR).send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'An error has occurred' });
      }
    });
};

const updateLike = (req, res, method) => {
  const {
    params: { id },
  } = req;
  Card.findByIdAndUpdate(
    id,
    { [method]: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('Id did not match existing card');
      error.statusCode = NOT_FOUND_ERROR;
      throw error;
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid Id' });
      } else if (err.statusCode === NOT_FOUND_ERROR) {
        res.status(NOT_FOUND_ERROR).send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'An error has occurred' });
      }
    });
};

const likeCard = (req, res) => updateLike(req, res, '$addToSet');

const dislikeCard = (req, res) => updateLike(req, res, '$pull');

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
