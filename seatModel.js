var mongoose = require('mongoose');

var seatSchema = new mongoose.Schema({
    movie_id: String,
    movie_name: String,
    round_movie: String,
    seat: [ String ]
}, {collection: 'all_seat_movie'});

var Seat = mongoose.model('all_seat_movie', seatSchema);

module.exports = Seat;
