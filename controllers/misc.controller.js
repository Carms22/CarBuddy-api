const Journey = require('../models/Journey.model');
const Score = require('../models/Score.model')

module.exports.search = (req, res, next) => {

  Journey.find({
    'origin.location':{
      $near: {
        $maxDistance: 1000,
        $geometry: {
          type: "Point",
          coordinates: [12.123, 13.11],
        },
      },
    }
  })
  .then( journeys => console.log(journeys)  )
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
  Journey.findById(journeyId)
    .populate({
      path: "score"
    })
    .then( journey => {
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