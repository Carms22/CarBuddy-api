const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/User.model');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const LoginError = createError(401, 'Email or password are not valid');
  if(!email || !password){
    next(LoginError)
  }else {
    User.findOne({ email })
      .then( user => {
        if(!user){
          next(LoginError)
        } else {
          user.checkPassword(password)
            .then( result => {
              if(!result){
                next(LoginError)
              }else{
                const token = jwt.sign(
                  {
                    id: user.id,
                  },
                   'Super secret',
                  {
                    expiresIn: '24h'
                  }
                )
                res.json({ accessToken: token });
              }
            })
        }
      })
  }
}