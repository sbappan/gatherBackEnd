const mongoose = require('mongoose');

const { Schema } = mongoose;
// Create Schema
const InterestSchema = new Schema({
  name: {
    type: String,
    required: 'Interest name is required',
    unique: 'Interest name must be unique',
  },
});

const Interest = mongoose.model('interests', InterestSchema);
module.exports = Interest;
