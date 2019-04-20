var express = require('express')
var mongoose = require('mongoose')
var app = express()

var urlDB = 'mongodb+srv://movie-ticket:aZA2pTp0PHHz1PZ2@movie-ticker-lq4km.gcp.mongodb.net/movie_ticket?retryWrites=true'

mongoose.connect(urlDB, { useNewUrlParser: true }).then(function () {
  console.log('connected')
})

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function (request, response) {
  response.send('Hello World!')
})

app.get('/get-all-movie', function (request, response) {
  
  var Schema = mongoose.Schema

  var movieSchema = new Schema({
    nameMovieEN: String,
    nameMovieTH: String,
    srcImg: String,
    timeMovie: Number,
    typeMovie: String,
    typeTheater: String,
    sound: String,
    rate: String,
    theater: Number,
    roundMovie: [String],
    price: {
      deluxe: Number,
      premium: Number,
      sofaSweet: Number
    }
  }, { collection: 'all_movie' })

  var Movie = mongoose.model('all_movie', movieSchema)

  Movie.find({}, function (err, result) {
    response.json(result)
  }).lean()
})

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'))
})
