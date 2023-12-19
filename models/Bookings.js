const mongoose = require("mongoose");

const BookingsSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    payable_amount: {
      type: Number,
      required: true,
    },
    checkIn: {
      type: Boolean,
      required: true,
    },
    checkOut: {
      type: Boolean,
      default: [],
    },
    checkInTime: {
      type: Date,
      required: true,
    },
    checkOutTime: {
      type: Date,
      required: true,
    },
    isPaymentDone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create a model from the schema
const Bookings = mongoose.model("Bookings", BookingsSchema);
module.exports = Bookings;
