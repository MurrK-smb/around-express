const fs = require('fs')
const fsPromises = require('fs').promises

const readFile1 = (path, callback) => {
  fs.readFile(path, 'utf-8', callback)
}

const readFile2 = (path) => fsPromises.readFile(path, { encoding: 'utf8' })

const readFile = (path) => new Promise((resolve, reject) => {
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) {reject(err)}
    resolve(data)
  })
})

module.exports = {
  readFile,
  readFile1,
  readFile2
}