const mongoose = require("mongoose");

const BookingsSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    roomName: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    hotel: {
      type: String,
      ref: "Hotel",
      required: true
    },
    amenities: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    images: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create a model from the schema
const Bookings = mongoose.model("Bookings", BookingsSchema);
module.exports = Bookings;


  