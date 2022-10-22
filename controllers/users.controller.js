const createError = require('http-errors');
const User = require('../models/User.model');

module.exports.list = (req, res, next) => {
  User.find()
    .then(users => {
      res.json(users)
    })
    .catch(next)
}
module.exports.create = (req, res, next) => {
  const data = req.body
  User.create(data)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(next)
}
module.exports.detail = (req, res, next) => {
  User.findById(req.currentUser)
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