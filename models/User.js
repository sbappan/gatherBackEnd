const mongoose = require('mongoose');

const { Schema } = mongoose;
// Create Schema
const UserSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
    },
    interests: [String],
    status: {
      isFlagged: {
        type: Boolean,
        default: false,
      },
      reason: {
        type: String,
        default: '',
      },
    },
    emailUpdates: {
      messageUpdates: {
        type: Boolean,
        default: false,
      },
      newGroupUpdates: {
        type: Boolean,
        default: false,
      },
      newEventUpdates: {
        type: Boolean,
        default: false,
      },
      replyUpdates: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);
const User = mongoose.model('users', UserSchema);
module.exports = User;
