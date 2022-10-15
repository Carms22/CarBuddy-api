const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    driver:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    journey:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Journey'
    }
  },
  {
    toJSON:{
      virtuals:true,
      transform:(doc, ret) => {
        delete ret.__v;
        delete ret._id;
        return ret
      }
    }
  },
  { timestamps: true }
);
const Booking = mongoose.model('Booking', BookingSchema);
module.exports = Booking;