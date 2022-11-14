require("dotenv").config()
const mongoose = require('mongoose');
const User = require('../models/User.model');
const USERS = require('../data/user.json');

const JOURNEYS = require('../data/journey.json');
const Journey = require("../models/Journey.model");

require('../config/db.config');

// VaciarlaS
// mongoose.connection.once('open', () => {
//   mongoose.connection.db.dropDatabase()
//     .then(() => {
//       console.info('Db dropped')
//       return User.create(USERS)
//     })
//     .then((createdUsers) => {
//       createdUsers.forEach(user => console.log(`${user.name} was created`))
//       return createdUsers
//     })
//     .then((createdUsers) => {
//       console.info('Journeys')
//       const journeys = JOURNEYS.map(journey => ({
//         ...journey,
//         creator: createdUsers[Math.floor(Math.random() * createdUsers.length)]
//       }))
//       return Journey.create(journeys)
//     })
//     .then((createdJourneys) => {
//       createdJourneys.forEach(journey => console.log(`${journey.origin} was created`))
//       // Cerrar la conexion
//       return mongoose.connection.close()
//     })
//     .then(() => {
//       console.log('Connection closed')
//       process.exit(1)
//     })
//     .catch(err => {
//       console.error(err)
//       process.exit(0)
//     })
// })

module.exports.cosas = () => {
  User.create(USERS)
    .then((createdUsers) => {
      createdUsers.forEach((user) => console.log(`${user.name} was created`));
      return createdUsers;
    })
    .then((createdUsers) => {
      console.info("Journeys");
      const journeys = JOURNEYS.map((journey) => ({
        ...journey,
        creator: createdUsers[Math.floor(Math.random() * createdUsers.length)],
      }));
      return Journey.create(journeys);
    })
    .then((createdJourneys) => {
      createdJourneys.forEach((journey) =>
        console.log(`${journey.origin} was created`)
      );
      // Cerrar la conexion
      return mongoose.connection.close();
    })
    .then(() => {
      console.log("Connection closed");
      process.exit(1);
    })
    .catch((err) => {
      console.error(err);
      process.exit(0);
    });
}