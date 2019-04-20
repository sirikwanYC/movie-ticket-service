var mongoose = require('mongoose')
var Schema = mongoose.Schema

var seatSchema = new Schema({
    movie_id: String,
    movie_name: String,
    round_movie: String,
    seat: [ String ]
}, {collection: 'all_seat_movie'})

module.exports = mongoose.model('all_seat_movie', seatSchema)
