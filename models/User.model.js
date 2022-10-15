const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const ROLLUSER =['Driver', 'Buddy']
const EMAIL_PATTERN = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
const PASSWORD_PATTERN = /^.{8,}$/i
const SALT_ROUNDS = 10

const UserSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, 'Name is requiered'],
    minLength: [3, 'Name must contain at least 3 characters.'],
    unique: [true, 'Username must be unique'],
},
email: {
    type: String,
    required: [true, 'Email is required.'],
    match: [EMAIL_PATTERN, 'Email must be valid.'],
    unique: true,
},
password: {
    type: String,
    required: [true, 'Password is required.'],
    match: [PASSWORD_PATTERN, 'Password must contain at least 8 characters.']
},
googleID: {
    type: String,
},
image: {
    type: String,
},
roll: {
    type: String,
    enum: ROLLUSER
}

},
{
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret._id;
      delete ret.password;

      return ret
    }
  }
},
{
    toObject: { virtuals: true },
  }
)

UserSchema.pre('save', function(next){
  if(this.isModified('password')){
    bcrypt.hash(this.password, SALT_ROUNDS)
      .then(hash =>{
        this.password = hash;
        next()
      } )
  } else {
    next()
  }
})

UserSchema.methods.checkPassword = function(passwordToCompare) {
  return bcrypt.compare(passwordToCompare, this.password);
}

const User = mongoose.model('User', UserSchema);
module.exports = User;