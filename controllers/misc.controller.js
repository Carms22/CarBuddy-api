const createError = require('http-errors');
const Booking = require('../models/Booking.model');
const Journey = require('../models/Journey.model');
const Score = require('../models/Score.model')


module.exports.search = (req, res, next) => {
  const data = this.postLatLong()
  console.log(data);
  
  const lng = req.params.lon;
  const lat = req.params.lat;
  Journey.find({
    location:{
      $near: {
        $maxDistance: 1000,
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
      },
    }
  })
  .then( journeys => console.log(journeys)  )
}

module.exports.postLatLong = (req, res, next) => {
  const lng = req.body[0];
  const lat = req.body[1];
  Journey.find({ 
    location:{
      $near: {
        $maxDistance: 10000,
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
      },
    }
    
  })
  .then( journeys => {
    console.log("journeys postLatLong:", journeys);
     res.status(200).json({ journeys })
  })  
  .catch(next)
}

// const lon = req.params.lon;
// const lat = req.params.lat;
// const shops = await Shop.find({
//   location: {
//     $near: {
//       $maxDistance: 1000,
//       $geometry: {
//         type: "Point",
//         coordinates: [lon, lat],
//       },
//     },
//   },
// });

// return res.status(200).json({
//   success: true,
//   data: shops,
// });


//Score
module.exports.score = (req, res, next) => {
  const userId = req.currentUser;
  const pointsGave = req.body.points
  const journeyId = req.params.id;
  Booking.find({journeyId})
    .populate({ path: "journey",
        populate:{
        path:"score"
      }
    })
    .then(bookings => {
      bookings.map( booking => {
        console.log("booking.user.id: ",booking.user.id.toString('hex'));
        console.log("userId: ",userId);
        if( userId === booking.user.id.toString('hex')){
          console.log("entro al if the bookings para poner validate a true");
          return booking.isValidated = true
          console.log(booking);
        }else{
          next(createError(401, "You can not rate this journey"))
        }
      })
      return bookings
    })
    .then( bookings => {
      return Score.create({
        user: userId,
        journey: journeyId,
        points: pointsGave,
      })
    })
    .then( score => {
      console.log(score);
      if(!score){
        next(createError(401, "Journey not found"))
      }
      res.status(200).json(score)
    })
    .catch(next)
}
// module.exports.score = (req, res, next) => {
//   const userId = req.currentUser;
//   const pointsGave = req.body.points
//   const journeyId = req.params.id;
  
//   Journey.findById(journeyId)
//     .populate({
//       path: "score"
//     })
//     .then( journey => {
//       return Score.create({
//         user: userId,
//         journey: journeyId,
//         points: pointsGave,
//       })
//     })
//     .then( score => {
//       console.log(score);
//       if(!score){
//         next(createError(401, "Journey not found"))
//       }
//       res.status(200).json(score)
//     })
//     .catch(next)
// }






module.exports.getScore = (req, res, next) => {
  const journeyId = req.params.id;
 
  Journey.findById(journeyId)
    .populate({path: "score"})
    .then(journey => {
      if (journey.score.points) {
        res.status(200).json(journey.score)
      }else {
        next(createError(401, "Journey not found"))
      }
    })
}