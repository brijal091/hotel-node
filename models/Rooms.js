const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: Number,
      required: true,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
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
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Create a model from the schema
const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;
