const createError = require('http-errors');
const Booking = require('../models/Booking.model');
const Journey = require('../models/Journey.model');
const Score = require('../models/Score.model')
const mongoose = require('mongoose');


module.exports.getJourneyFromSearch = (req, res, next) => {
  const {lng, lat} = req.query;
  console.log('***** ', lng, lat);
  Journey.find({ 
    'destination.location': {
      $near: {
        $maxDistance: 5000,
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
      },
    }
  })
  .then( journeys => {
    console.log("journeys postLatLong:", journeys);
     res.status(200).json(journeys)
  })  
  .catch(next)
}


//Score
module.exports.score = (req, res, next) => {
  const userId = new mongoose.mongo.ObjectId(req.currentUser);
  const pointsGave = req.body.points;
  const BookingId = req.params.id;

  Booking.findById(BookingId)
    .then(booking => {
      if(booking.user._id.equals(userId)){
        console.log("entro al if the bookings para poner validate a true");
        Booking.findByIdAndUpdate(booking.id, {isValidated: true})
          .then(() => {
            return Score.create({
              user: userId,
              journey: booking.journey,
              points: pointsGave,
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


module.exports.getScore = (req, res, next) => {
  const journeyId = req.params.id;
 
  Journey.findById(journeyId)
    .populate({
      path: "score"
  })
    .then(journey => {
      console.log(journey.score);
      journey.score.map( score => {
        if (score.points) {
          let totalPoints=+score.points
         res.status(200).json(totalPoints)
       }else {
         next(createError(404, "Journey not found"))
       }
      })
    })
}