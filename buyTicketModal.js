var mongoose = require('mongoose')

var buyTicketSchema = new mongoose.Schema({
    name: { type: String, required: true},
    mail: String,
    tel: String,
    movie_id: { type: String, required: true},
    movie_name: { type: String, required: true },
    round_movie: { type: String, required: true },
    seat: [{ type: String, required: true}],
}, {collection: 'all_ticket_movie'})


var Ticket = mongoose.model('all_ticket_movie', buyTicketSchema)

module.exports = {
    Ticket
}