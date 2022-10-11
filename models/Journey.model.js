const mongoose = require('mongoose');

const journeySchema = new mongoose.Schema({
    seats: {
        type: Number,
        required: [true, 'Number of seats is required.'],
    },
    origin: {
        type: String,
        required: [true, 'Origin of the journey is required.'],
    },
    destination:{
        type: String,
        required: [true, 'Destination of the journey is required.'],
    },
    departureTime:{
        type: Number,
        required: [true, 'Departure time is required.'],
    },
    returnTime:{
        type: Number,
        required: [true, 'Departure time is required.'],
    },
    price:{
        type:String,
    },
    date:{
        type: Date,
        required: [true, 'Date is required.'],
        min: Date.now
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
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
{
    toObject: { virtuals: true },
  }
)

journeySchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "journey",
    justOne: false,
})
journeySchema.virtual("score", {
    ref: "Score",
    localField: "_id",
    foreignField: "journey",
    justOne: false,
})


const Journey = mongoose.model('Journey', journeySchema);
module.exports = Journey;