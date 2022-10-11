const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    journey:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Journey',
        required: true
    }
},
{
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret._id;

      return ret
    }
  }
},
{ timestamps: true });

const Score = mongoose.model('Score', ScoreSchema);
module.exports = Score;
