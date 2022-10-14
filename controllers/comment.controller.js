const createError = require('http-errors');
const Comment = require('../models/Comment.model');
const { populate } = require('../models/User.model');

module.exports.list = (req, res, next) => {
  Comment.find()
    .populate({
      path:'user',
      populate: {
        path: 'journey'
      }
    })
    .then( comments => {
      if(!comments){
        next(createError(404, 'Comments not found'))
      } else {
        res.status(201).json(comments)
      }
    })
    .catch(next)
}

module.exports.create = (req, res, next) => {
    const data = req.body
    Comment.create(data)
      .then ( commentCreated => {
        console.log("comentadio creado");
        res.status(201).json(commentCreated)
      })
      .catch(next)
}