const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema({
  hotelCode: {
    type: String,
    required: true,
    unique: true
  },
  hotelName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  facilities: {
    type: [String],
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },  
}, {
    timestamps: true
});

module.exports = mongoose.model("Hotel", HotelSchema);
