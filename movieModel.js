var mongoose = require('mongoose')

var movieSchema = new mongoose.Schema({
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
}, {collection: 'all_movie'})


var Movie = mongoose.model('all_movie', movieSchema)
module.exports = {
    Movie
}