const createError = require('http-errors');
const Journey = require('../models/Journey.model');
const Booking = require('../models/Booking.model');

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
        next(createError(401, "There is no seats left"))
      }
    })
    .catch(next)
}