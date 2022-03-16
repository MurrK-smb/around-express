const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const routes = require('./routes')
const helmet = require('helmet')

const { PORT = 5000, BASE_PATH } = process.env
const app = express()

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
  req.user = { _id: '622afb8a9b4de5837c2467a7' }
  next()
})

app.use('/', routes)

app.listen(PORT, () => {
  console.log('ok')
  console.log(BASE_PATH)
})