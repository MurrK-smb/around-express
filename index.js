const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')

const { PORT = 5000, BASE_PATH } = process.env
const app = express()

const userRouter = require('./routes/users')
const cardRouter = require('./routes/cards')

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
})

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  req.user = { _id: '622afb8a9b4de5837c2467a7' }
  next()
})

app.use('/users', userRouter)
app.use('/cards', cardRouter)

app.listen(PORT, () => {
  console.log('ok')
  console.log(BASE_PATH)
})