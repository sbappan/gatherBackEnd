const mongoose = require('mongoose');

const { Schema } = mongoose;
// Create Schema
const GroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    members: [
      {
        _id: String,
        isAdmin: Boolean,
      },
    ],
    interests: [String],
    comments: [
      {
        message: String,
        user: String,
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
      },
    ],
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
  },
  { timestamps: true }
);

const Group = mongoose.model('groups', GroupSchema);
module.exports = Group;
