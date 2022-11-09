const createError = require('http-errors');
const Booking = require('../models/Booking.model');
const Journey = require('../models/Journey.model');
const Score = require('../models/Score.model')
const mongoose = require('mongoose');

//Search by destination(3km)
module.exports.getJourneyFromSearch = (req, res, next) => {
  const {lng, lat} = req.query;
  
  Journey.find({ 
    'destination.location': {
      $near: {
        $maxDistance: 3000,
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
      },
    }
  })
  .populate('score')
  .populate('creator')
  .then( journeys => {
     res.status(200).json(journeys)
  })  
  .catch(next)
}

//SCORE
//Create Score
module.exports.score = (req, res, next) => {
  const userId = new mongoose.mongo.ObjectId(req.currentUser);
  const pointsGave = req.body.points;
  const BookingId = req.params.id;

  Booking.findById(BookingId)
    .then(booking => {
      if(booking.user._id.equals(userId)){
        console.log("entro al if the bookings para poner validate a true");
        Booking.findByIdAndUpdate(booking.id, {isValidated: true})
          .populate('journey')
          .then((booking) => {
            return Score.create({
              user: userId,
              journey: booking.journey,
              points: pointsGave,
              creator: booking.journey.creator
            })
          })
          .then(score => {
            if(!score){
              next(createError(404, "Journey not found"))
            }
            res.status(200).json(score)
          })
      } else {
        next(createError(400, "You can not rate this journey"))
      }
    })
    .catch(next)
}

//Get scores of journey
module.exports.getScore = (req, res, next) => {
  const journeyId = req.params.id;
 
  Journey.findById(journeyId)
    .populate({
      path: "score"
  })
    .then(journey => {
      console.log(journey.score);
      res.status(200).json(journey.score)
    })
    .catch(next)
}

