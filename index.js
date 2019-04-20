var express = require('express');
var mongoose = require('mongoose');
var app = express();
var Movie = require('./movieModel.js');
var Seat = require('./seatModel.js');
var Ticket = require('./buyTicketModal.js');
var bodyParser = require("body-parser");

var urlDB = 'mongodb+srv://movie-ticket:aZA2pTp0PHHz1PZ2@movie-ticker-lq4km.gcp.mongodb.net/movie_ticket?retryWrites=true';

mongoose.connect(urlDB, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type : 'application/vnd.api+json'}));
app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
  response.send('Hello World!');
});

app.get('/get-all-movie', function (request, response) {
  Movie.find({}, function (err, result) {
    response.json(result);
  }).lean();
});

app.get('/get-seat-movie/name-movie/:nameMovie/round-movie/:roundMovie', function (request, response) {
  Seat.findOne({ movie_name: request.params.nameMovie, round_movie: request.params.roundMovie },
    function (err, result) {
      response.json(result);
    }).lean();
});

app.post('/insert-ticket', function (request, response) {
  var movie_id = request.body.movie_id;
  var round_movie = request.body.round_movie;
  var movie_name = request.body.movie_name;
  var seat  = request.body.seat;

  var newTicket = new Ticket(request.body);

  newTicket.save(function (err) {
    if (err) response.status(401).end();
    else response.status(200).end();
  });

  Seat.findOne({ movie_id, round_movie },
    function (err, result) {
      if (result !== null) {
        Seat.updateOne({ movie_id }, { $push: { seat } },
          function () { })
      } else {
        var newSeat = new Seat({ movie_id, movie_name, round_movie, seat });
        newSeat.save(function () { });
      }
    });

});

app.get('/search-movie', function (request, response) {
  var name_movie = request.query.name_movie;
  var sort = request.query.sort;
  Movie.find({
    $or: [
      { name_movie_en: { '$regex': name_movie, '$options': 'i' } },
      { name_movie_th: { '$regex': name_movie, '$options': 'i' } }
    ]
  }, function (err, result) {
    if (err) {
      response.status(403).end();
    } else {
      response.json(result);
    }
  }).sort({ 'price.deluxe': sort });
});

app.listen(5000, function () {
  console.log("Node app is running at localhost: 5000");
});
