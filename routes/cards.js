const router = require('express').Router()

const { 
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
 } = require('../controllers/cards')

router.get('/', getCards)
router.get('/', createCard)
router.get('/:id', deleteCard)
router.get('/:id/likes', likeCard)
router.get('/:id/likes', dislikeCard)

module.exports = router