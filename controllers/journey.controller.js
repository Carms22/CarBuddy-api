const createError = require('http-errors');
const Journey = require('../models/Journey.model');
const Comment = require('../models/Comment.model');
const Score = require('../models/Score.model');
const User = require('../models/User.model');

//Journey
module.exports.list = (req, res, next) => {
  Journey.find()
    .then(journeys => {
      res.json(journeys)
    })
    .catch(next)
}

module.exports.create = (req, res, next) => {
  const data = req.body
  data.creator = req.currentUser
  console.log("data backend from create",data);
  Journey.create(data)
    .then(journeycreated =>{ 
      res.status(201).json(journeycreated)
    })
    .catch(next)
}
module.exports.detail = (req, res, next) => {
  const journeyId = req.params.id;
  Journey.findById(journeyId)
    .populate({ path: "comments"})
    .populate({ path: "score"})
    .then(journey => {
      console.log(journey);
      if(!journey){
        next(createError(404,'Journey not found'))
      }else{ 
        res.status(201).json(journey)
      }
    })
    .catch(next)
}

module.exports.edit = (req, res, next) => {

}
module.exports.delete = (req, res, next) => {

}


//Comments
module.exports.comment = (req, res, next)=> {
  const journeyId = req.params.id;
  const userId = req.currentUser;
  console.log(userId);
  const { content } = req.body;
  Journey.findById(journeyId)
  .populate({
      path: "comments"
  })
  .then(journey  => {
    console.log("entro en findById en journey", journey)
    Comment.create({
        journey: journeyId,
        commentCreator: userId,
        driver: journey.creator,
        content: content
    })
    return journey
  })
  .then(journey => {
    console.log('comment created',journey);
    res.status(201).json(journey)
  })
  .catch(next)
}

module.exports.deleteComment =(req, res, next) => {

}

//Score
module.exports.score = (req, res, next) => {
  const userId = req.currentUser;
  const pointsGave = req.body.points
  const journeyId = req.params.id;
  console.log('Score entro', journeyId);
  Journey.findById(journeyId)
    .populate({
      path: "score"
    })
    .then( journey => {
      Score.create({
        user: userId,
        journey: journeyId,
        points: pointsGave,
        driver: journey.creator.toString()
      })
      return journey
    })
    .then( result => {
      if(!result){
        next(createError(401, "Journey not found"))
      }
      res.status(401).json(result)
    })
    .catch(next)
}
