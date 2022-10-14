const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: [true, 'Content of the post is required']
    },
    journey:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Journey',
      required: true
    },
    commentCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
  }
)

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;