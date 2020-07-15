const mongoose = require('mongoose');

const { Schema } = mongoose;
// Create Schema
const EventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    group: {
      type: String,
      required: true,
    },
    attendees: [String],
    location: {
      line1: {
        type: String,
        required: true,
      },
      line2: {
        type: String,
        default: '',
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      province: {
        type: String,
        required: true,
      },
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
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model('events', EventSchema);
module.exports = Event;
