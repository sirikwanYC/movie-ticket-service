var mongoose = require('mongoose')
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
}, {collection: 'all_movie'})

module.exports = mongoose.model('all_movie', movieSchema)
