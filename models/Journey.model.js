const mongoose = require('mongoose');
const VEHICLE =['Car', 'Motorcycle'];

const journeySchema = new mongoose.Schema({
    vehicle: {
        typeOf:{
            type: String,
            enum:VEHICLE
        },
        seats: {
            type: String,
            required: [true, 'Number of seats is required.'],
            min:[1, "Min 1 seat per vehicle"],
            max:[3, "Max 1 per motorcycle-3 per car seat per vehicle"]
        }
      },
    origin: {
        street: {
            type: String,
            required: [true, 'Origin of the journey is required.'], 
        },
        location: {
            type: [Number],
            coordinates: []
        }
    },
    destination:{
        street:{
            type: String,
            required: [true, 'Destination of the journey is required.'],
        },
        location: {
            type: [Number],
            coordinates: []
        }
    },
    departureTime:{
        type: String,
        required: [true, 'Departure time is required.'],
    },
    returnTime:{
        type: String,
        required: [true, 'Departure time is required.'],
    },
    price:{
        type:Number,
    },
    date:{
        type: Date,
        required: [true, 'Date is required.'],
        min: Date.now
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
journeySchema.index({ "destination.location": "2dsphere" });

const Journey = mongoose.model('Journey', journeySchema);
module.exports = Journey;

