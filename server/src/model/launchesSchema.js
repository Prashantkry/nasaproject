const mongoose = require("mongoose");
const launchesSchema = new mongoose.Schema({
  // flightNumber:Number,    // can be a single data or can be object
  flightNumber: {
    type: Number,
    required: true,
    // default: 100,
    // min: 100,
    // max: 999,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  //   target: {  not supported in mongo db properly
  //     type: mongoose.ObjectId, // act as a foreign key
  //     ref: "Planet",  // reference work of SQL
  //   },
  target: {
    type: String,
    // required: true,    // spacesX having problem in inserting 1st launch 
  },
  upcoming: {
    type: Boolean,
    required: true,
  },
  customer: [String],
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
});

module.exports = mongoose.model("Launch", launchesSchema);
