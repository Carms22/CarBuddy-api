const createError = require('http-errors');
const Journey = require('../models/Journey.model');
const Comment = require('../models/Comment.model');
const Score = require('../models/Score.model');

//Journey
module.exports.list = (req, res, next) => {
  Journey.find()
    .populate('score')
    .then(journeys => {
      res.status(200).json(journeys)
    })
    .catch(next)
}

module.exports.create = (req, res, next) => {
  const data = req.body
  data.creator = req.currentUser
  Journey.create(data)
    .then(journeycreated =>{ 
      res.status(201).json(journeycreated)
    })
    .catch(next)
}
module.exports.detail = (req, res, next) => {
  const journeyId = req.params.id;
  Journey.findById(journeyId)
    .populate({ 
      path: "comments",
      populate: {
        path: "commentCreator"
      }
    })
    .populate({ path: "score"})
    .populate({ path: "creator"})
    .then(journey => {
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
  const { content } = req.body;

  Journey.findById(journeyId)
  .populate({
      path: "comments"
  })
  .then(journey  => {
    Comment.create({
        journey: journeyId,
        commentCreator: userId,
        driver: journey.creator.toString(),
        content: content
    })
    return journey
  })
  .then(journey => {
    res.status(201).json(journey)
  })
  .catch(next)
}

module.exports.deleteComment =(req, res, next) => {

}


