const createError = require('http-errors');
const Journey = require('../models/Journey.model');
const Booking = require('../models/Booking.model');

//Make a booking
module.exports.createBooking = (req, res, next) => {
  const journeyId = req.params.id;
  const user = req.currentUser;
 
  Journey.findById(journeyId)
    .then(journey => {
      if (journey.vehicle.seats > 0) {
        const seats = journey.vehicle.seats - 1;
        Journey.findByIdAndUpdate(journeyId, { 'vehicle.seats': seats })
          .then(journey => Booking.create({ journey, user }))
          .then(booking => booking.populate('user'))
          .then(booking => booking.populate({ path: 'journey', populate: { path: 'creator' } }))
          .then(bookingCreated => res.status(200).json(bookingCreated))
      } else {
        next(createError(400, "There is no seats left"))
      }
    })
    .catch(next)
}


//Bookings of user
module.exports.bookingByUser = (req, res, next) => {
  const user = req.currentUser;
  Booking.find({user})
    .populate({ path: 'journey', populate: { path: 'creator' } })
    .then(userBookings => {
      if(userBookings) {
        res.status(200).json(userBookings)
      }
      next(createError(404, "There is not bookings yet"))
    })
    .catch(next)
}

//Booking by journey
module.exports.bookingByJourney = (req, res, next) => {
  const user = req.currentUser;
  const journeyId = req.params.id
  Booking.find({journeyId})
    .populate({
      path: 'user',
      populate: {
        path: 'score'
      }
    })
    .then(bookingsByJourney => {
      if(bookingsByJourney) {
        res.status(200).json(bookingsByJourney)
      } else {
        next(createError(404, "There is not bookings yet"))
      }
    })
    .catch( err => console.log(err))
}