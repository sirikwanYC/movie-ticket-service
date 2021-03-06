var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require("body-parser")
var cors = require('cors')
var nodemailer = require("nodemailer")
var app = express()

var urlDB = 'mongodb+srv://movie-ticket:aZA2pTp0PHHz1PZ2@movie-ticker-lq4km.gcp.mongodb.net/movie_ticket?retryWrites=true'

mongoose.connect(urlDB, { useNewUrlParser: true }).then(function () {
  console.log('connected')
})

app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.urlencoded({ 'extended': 'true' }))
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.use(cors({
  origin: '*',
  credentials: true
}))
app.use(express.static(__dirname + '/public'))

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

var buyTicketSchema = new Schema({
  name: { type: String, required: true },
  mail: String,
  tel: String,
  theater: Number,
  movie_id: { type: String, required: true },
  movie_name: { type: String, required: true },
  round_movie: { type: String, required: true },
  seat: [{ type: String, required: true }],
}, { collection: 'all_ticket_movie' })
var Ticket = mongoose.model('all_ticket_movie', buyTicketSchema)

var seatSchema = new Schema({
  movie_id: String,
  movie_name: String,
  round_movie: String,
  seat: [String]
}, { collection: 'all_seat_movie' })
var Seat = mongoose.model('all_seat_movie', seatSchema)


app.get('/', function (request, response) {
  response.send('Hello World!')
})

app.get('/get-all-movie', function (request, response) {
  Movie.find({}, function (err, result) {
    response.json(result)
  }).lean()
})

app.get('/get-movie/:id', function (request, response) {
  Movie.findById(request.params.id, function (err, result) {
    response.json(result)
  }).lean()
})

app.get('/get-ticket/:id', function (request, response) {
  Ticket.findById(request.params.id, function (err, result) {
    response.json(result)
  }).lean()
})

app.get('/get-seat-movie/name-movie/:nameMovie/round-movie/:roundMovie', function (request, response) {
  Seat.findOne({ movie_name: request.params.nameMovie, round_movie: request.params.roundMovie },
    function (err, result) {
      response.json(result)
    }).lean()
})

app.post('/insert-ticket', function (request, response) {
  var movie_id = request.body.movie_id
  var round_movie = request.body.round_movie
  var movie_name = request.body.movie_name
  var seat = request.body.seat
  var theater = request.body.theater
  var dateCreate = request.body.date

  var newTicket = new Ticket(request.body)

  newTicket.save(function (err, res) {
    response.json(res)

    if (request.body.mail.length !== 0) {
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'movie.ticket2019@gmail.com',
          pass: '6BZJkpBfHzRs5H5'
        }
      })
      let mailOptions = {
        from: '"Movie Ticket" <movie.ticket2019@gmail.com>', 
        to: request.body.mail, 
        subject: 'รายละเอียดตั๋วภาพยนตร์ คุณ ' + request.body.name, 
        html: `<span> สามารถเข้าไปดูรายละเอียดตั๋วภาพยนตร์ได้ </span> <a href="https://movie-ticket-a8a41.firebaseapp.com/show-ticket/${res._id}" > คลิกที่นี่่ </a>`, 
      }
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        res.render('index');
      })
    }
  })


  Seat.findOne({ movie_id, round_movie },
    function (err, result) {
      if (result !== null) {
        Seat.updateOne({ movie_id }, { $push: { seat } },
          function () { })
      } else {
        var newSeat = new Seat({ movie_id, movie_name, round_movie, seat })
        newSeat.save(function () { })
      }
    })

})

app.get('/search-movie', function (request, response) {
  var name_movie = request.query.name_movie
  var sort = request.query.sort
  Movie.find({
    $or: [
      { name_movie_en: { '$regex': name_movie, '$options': 'i' } },
      { name_movie_th: { '$regex': name_movie, '$options': 'i' } }
    ]
  }, function (err, result) {
    if (err) {
      response.status(403).end()
    } else {
      response.json(result)
    }
  }).sort({ 'price.deluxe': sort })
})

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'))
})


