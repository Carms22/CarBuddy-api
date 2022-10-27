const createError = require('http-errors');
const Booking = require('../models/Booking.model');

module.exports.isYourBooking = (req, res, next) => {
  const journeyId = req.params.id;
  const userId = req.currentUser;
  Booking.find({journeyId, userId})
    .then(bookings => {
      if(bookings){
        console.log(bookings)
        res.status(200).json(bookings)
        next
      } else{
        next(createError(401, "You can not validate this journey"))
      }
    })
}