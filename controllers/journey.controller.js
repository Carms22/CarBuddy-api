const createError = require('http-errors');
const Journey = require('../models/Journey.model');
const Comment = require('../models/Comment.model');
const Score = require('../models/Score.model');
const User = require('../models/User.model');


module.exports.list = (req, res, next) => {
  Journey.find()
    .then(journeys => {
      res.json(journeys)
    })
    .catch(next)
}

module.exports.create = (req, res, next) => {
  const data = req.body
  Journey.create(data)
    .then(journeycreated =>{ 
      console.log("Journey created",journeycreated );
      res.status(201).json(journeycreated)
    })
    .catch(next)
}
module.exports.detail = (req, res, next) => {
  const journeyId = req.params.id;
  Journey.findById(journeyId)
    .populate({
        path: "comments"
    })
    .then(journey => {
      if(!journey){
        next(createError(404,'Journey not found'))
      }else{
        res.status(201).json(journey)
      }
    })
    .catch(next)
}

module.exports.comment = (req, res, next)=> {
  const journeyId = req.params.id;
  //const userId = req.currentUser;
  const userId = "6349be452ff90d96a5108be9";
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
