const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/User.model');

module.exports.login = (req, res, next) => {
  console.log("entro en el login del back");
  const { email, password } = req.body;
  const LoginError = createError(401, 'Email or password are not valid');
  if(!email || !password){
    next(LoginError)
  }else {
    User.findOne({ email })
      .then( user => {
        console.log("Estoy en el login del back buscando User");
        if(!user){
          console.log("Estoy en el login del back No hay usuario--next(err)");
          next(LoginError)
        } else {
          console.log("Estoy en el login del back SI hay usuario-REsult");
          user.checkPassword(password)
            .then( result => {
              if(!result){
                console.log("result err");
                next(LoginError)
              }else{
                console.log("creo token");
                const token = jwt.sign(
                  {
                    id: user.id,
                  },
                   'Super secret',
                  {
                    expiresIn: '24h'
                  }
                )
                console.log(token);
                res.json({ accessToken: token });
              }
            })
        }
      })
  }
}