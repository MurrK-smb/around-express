const path = require('path')
const { readFile } = require('../helpers')

const CARDS_PATH = path.join(__dirname, '../data/cards.json')

const getCards = (req, res) => {
  readFile(CARDS_PATH)
  .then(cards => res.send({ data: JSON.parse(cards)}))
  .catch(() => res.send({ message: 'Error has occurred on the server'}))
}
