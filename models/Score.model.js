const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    journey:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Journey',
      required: true
    },
    points:{
      type: Number,
      min:[0, "From 0 to 5 points ;) "],
      max:[5, "5 is the limit"]
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
  },
  timestamps: true
},)

const Score = mongoose.model('Score', ScoreSchema);
module.exports = Score;
