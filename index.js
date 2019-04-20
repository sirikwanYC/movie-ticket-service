var express = require('express')
const mongoose = require('mongoose')
var app = express()
const route = require('./src/route')

const urlDB = 'mongodb+srv://movie-ticket:aZA2pTp0PHHz1PZ2@movie-ticker-lq4km.gcp.mongodb.net/movie_ticket?retryWrites=true'

mongoose.connect(urlDB, {useNewUrlParser: true}).then(
    () => { console.log('connected') },
    err => { console.log(err) }
  )

app.use(express.static(__dirname + '/public'))

route(app)

app.listen(5000, function() {
  console.log("Node app is running at localhost: 5000")
})
