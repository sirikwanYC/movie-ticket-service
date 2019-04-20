const express = require('express')
const mongoose = require('mongoose')
const route = require('./src/route')

const urlDB = 'mongodb+srv://movie-ticket:aZA2pTp0PHHz1PZ2@movie-ticker-lq4km.gcp.mongodb.net/movie_ticket?retryWrites=true'

mongoose.connect(urlDB, {useNewUrlParser: true}).then(
    () => { console.log('connected') },
    err => { console.log(err) }
  )

const server = express()

server.use(express.static(__dirname + '/public'))

route(server)



server.listen(5000, () => console.log(`running server now! 5000`))
