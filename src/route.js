const Movie = require('./models/movieModel')
const Seat = require('./models/seatModel')
const Ticket = require('./models/buyTicketModal')

function route (app) {
    app.get('/get-all-movie', ((req, res) => {
        Movie.find({}, function (err, result) {
            res.json(result)
        }).lean()

    }))

    app.get('/get-seat-movie/name-movie/:nameMovie/round-movie/:roundMovie', ((req, res) => {
        Seat.findOne({ movie_name: req.params.nameMovie, round_movie: req.params.roundMovie },
            function (err, result) {
                res.json(result)
            }).lean()
    }))

    app.post('/insert-ticket', ((req, res) => {
        const { movie_id, round_movie, movie_name, seat } = req.body
        const newTicket = new Ticket(req.body)
        newTicket.save(function (err) {
            if (err) res.status(401).end()
            else res.status(200).end()
        })

        Seat.findOne({ movie_id, round_movie },
            function (err, result) {
                if (result !== null) {
                    Seat.updateOne({ movie_id }, { $push: { seat } },
                        function () { })
                } else {
                    const newSeat = new Seat({ movie_id, movie_name, round_movie, seat })
                    newSeat.save(function () { })
                }
            })
    }))

    app.get('/search-movie', ((req, res) => {
        const { name_movie, sort } = req.query
        Movie.find({
            $or: [
                { name_movie_en: { '$regex': name_movie, '$options': 'i' } },
                { name_movie_th: { '$regex': name_movie, '$options': 'i' } }
            ]
        }, function (err, result) {
            if (err) {
                res.status(403).end()
            } else {
                res.json(result)
            }
        }).sort({ 'price.deluxe': sort })
    }))
}

module.exports = route