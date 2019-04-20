var express = require('express')
const mongoose = require('mongoose')
var app = express()

const urlDB = 'mongodb+srv://movie-ticket:aZA2pTp0PHHz1PZ2@movie-ticker-lq4km.gcp.mongodb.net/movie_ticket?retryWrites=true'

mongoose.connect(urlDB, { useNewUrlParser: true })

app.use(express.static(__dirname + '/public'))

app.get('/', function (request, response) {
  response.send('Hello World!')
})

app.listen(5000, function () {
  console.log("Node app is running at localhost: 5000")
})
