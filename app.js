const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')

const { PORT = 5000, BASE_PATH } = process.env
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', routes)

app.listen(PORT, () => {
  console.log('ok')
  console.log(BASE_PATH)
})