const createError = require('http-errors');
const User = require('../models/User.model');
const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary")
const multer = require("multer");
const Journey = require('../models/Journey.model');

module.exports.list = (req, res, next) => {
  User.find()
    .then(users => {
      res.json(users)
    })
    .catch(next)
}

//new user
module.exports.create = (req, res, next) => {
  const data = req.body
  if(req.file){
    req.body.image = req.file.path
  }
  User.create(data)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(next)
}

//user detail
module.exports.detail = (req, res, next) => {
  User.findById(req.currentUser)
    .populate('score')
    .then(user => {
      res.status(201).json(user)
    })
    .catch(next)
}

module.exports.getCurrentUser = (req, res, next) => {
  console.log(req.currentUser);
  User.findById(req.currentUser)
    .then(user => {
      if (!user) {
        next(createError(401, 'Unauthrorized'));
      } else {
        res.json(user);
      }
    })
    .catch(next)
}

module.exports.getCreator = (req, res, next) => {
  const journeyId = req.params.id
  Journey.findById(journeyId)
    .populate({
      path: 'creator',
      populate: {
        path: 'score'
      }
    })
    .then(journey => {
      console.log(journey.creator);
      res.status(200).json(journey.creator)
    })
    .catch(err => console.log(err))

}