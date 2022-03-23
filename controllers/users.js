const User = require('../models/user');
const {
  CREATED_SUCCESS,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error occurred' }));
};

const getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => {
      const error = new Error('User Id not found');
      error.statusCode = NOT_FOUND_ERROR;
      throw error;
    })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid user Id' });
      } else if (err.statusCode === NOT_FOUND_ERROR) {
        res.status(NOT_FOUND_ERROR).send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED_SUCCESS).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const error = new Error('User Id not found');
      error.statusCode = NOT_FOUND_ERROR;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Id not found' });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      }
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Invalid user Id' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'An error has occurred on the server' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error('Avatar Id not found');
      error.statusCode = NOT_FOUND_ERROR;
      throw error;
    })
    .then((user) => res.status(CREATED_SUCCESS).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      }
      if (err.statusCode === 404) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Id not found' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid Id' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'An error has occurred on the server' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
