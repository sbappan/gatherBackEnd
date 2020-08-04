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
    posts: [
      {
        message: String,
        createdBy: String,
        date: {
          type: Date,
          default: Date.now,
        },
        status: {
          isFlagged: {
            type: Boolean,
            default: false,
          },
          reason: {
            type: String,
            default: '',
          },
          updatedBy: {
            type: String,
            required: true,
          },
        },
        comments: [
          {
            message: String,
            createdBy: String,
            date: {
              type: Date,
              default: Date.now,
            },
          },
        ],
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
      updatedBy: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const Group = mongoose.model('groups', GroupSchema);
module.exports = Group;
