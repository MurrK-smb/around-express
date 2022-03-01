const path = require('path')
const { readFile } = require('../helpers')

const USERS_PATH = path.join(__dirname, '../data/users.json')

const getUsers = (req, res) => {
  readFile(USERS_PATH)
    .then(users => res.send({ data: JSON.parse(users)}))
    .catch(() => res.send({ message: 'Error has occurred on the server'}))
}

const getUser = (req, res) => {
  readFile(USERS_PATH)
    .then(users => {
      const { id } = req.params
      const parsedUsersData = JSON.parse(users)
      const user = parsedUsersData.find(({ _id: userId }) => userId === id)

      if (!user) {res.status(404).send({ message: 'User ID not found' })}
      else {res.send({ data: user })}
    })
    .catch(() => res.status(500).send({ message: 'Error has occurred on the server' }))
}

module.exports = {
  getUsers,
  getUser
}