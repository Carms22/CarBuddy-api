require("dotenv").config()
const mongoose = require('mongoose');
const User = require('../models/User.model');
const USERS = require('../data/user.json')

require('../config/db.config');

// VaciarlaS
mongoose.connection.once('open', () => {
  mongoose.connection.db.dropDatabase()
    .then(() => {
      console.info('Db dropped')
      return User.create(USERS)
    })
    .then(createdUsers => {
      createdUsers.forEach(user => console.log(`${user.name} was created`))
      // Cerrar la conexion
      return mongoose.connection.close()
    })
    .then(() => {
      console.log('Connection closed')
      process.exit(1)
    })
    .catch(err => {
      console.error(err)
      process.exit(0)
    })
})