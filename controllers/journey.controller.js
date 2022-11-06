const createError = require('http-errors');
const Journey = require('../models/Journey.model');
const Comment = require('../models/Comment.model');
const Score = require('../models/Score.model');

//Journeys
module.exports.list = (req, res, next) => {
  Journey.find()
    .populate('score')
    .populate({
      path: 'creator',
      populate: {
        path: 'score'
      }
    })
    .then(journeys => {
      res.status(200).json(journeys)
    })
    .catch(next)
}

// All journeys by user
module.exports.listByUser = (req, res, next) => {
  const journeyId = req.params.id
  Journey.findById(journeyId)
    .then( journey => {
      Journey.find({'creator' : journey.creator})
      .populate('score')
      .then(journeys => {
        res.status(200).json(journeys)
      })
    })
    .catch(next)
}

//Create journey
module.exports.create = (req, res, next) => {
  const data = req.body
  data.creator = req.currentUser
  Journey.create(data)
    .then(journeycreated =>{ 
      res.status(201).json(journeycreated)
    })
    .catch(next)
}

//JOurney detail
module.exports.detail = (req, res, next) => {
  const journeyId = req.params.id;
  Journey.findById(journeyId)
    .populate({ path: "score"})
    .populate({ 
      path: "comments",
      populate: {
        path: "commentCreator"
      }
    })
    .populate({
      path: 'creator',
      populate: {
        path: 'score'
      }
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

module.exports.edit = (req, res, next) => {
  const journeyId = req.params.id
  console.log(req.body);
  Journey.findByIdAndUpdate(journeyId, req.body, {
    new: true
  })
  .then(journey => {
    res.status(201).json(journey)
  })

}

//Delete journey by id 
module.exports.delete = (req, res, next) => {
  const journeyId = req.params.id;
  const userId = req.currentUser;
  console.log("delete", journeyId);
  Journey.findByIdAndDelete( journeyId )
    .then( journeyDeleted => {
      console.log(journeyDeleted);
      res.status(204).send({ success: 'journey removed from data base'})
    })
  .catch(next)
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




