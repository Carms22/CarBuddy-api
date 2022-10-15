const Journey = require('../models/Journey.model');

module.exports.search = (req, res, next) => {
  Journey.find({
    origen: {
      $regex: new RegExp(origen, "i")
    }
  })
}