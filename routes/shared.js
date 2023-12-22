const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");
const Room = require("../models/Rooms");
const Booking = require("../models/Bookings");
const mongoose = require("mongoose");

const checkAllRoomsAvailability = async (checkInTime, checkOutTime) => {
    try {
      const rooms = await Room.find();
      const availabilityResults = await Promise.all(rooms.map(async (room) => {
        // Check if there are any bookings for the specified room and time range
        const existingBooking = await Booking.findOne({
          room: room._id,
          $or: [
            { checkInTime: { $lt: checkOutTime }, checkOutTime: { $gt: checkInTime } },
            { checkInTime: { $gte: checkInTime, $lt: checkOutTime } },
            { checkOutTime: { $gt: checkInTime, $lte: checkOutTime } },
          ],
        });
  
        return {
          room: room,
          isAvailable: !existingBooking,
        };
      }));
  
      return availabilityResults;
    } catch (error) {
      console.error('Error checking all rooms availability:', error);
      throw error;
    }
  };

router.post("/showrooms", async (req, res) => {
 let {checkInDate, checkOutDate} = req.body;
 const allRoomsAvailability = await checkAllRoomsAvailability(new Date(checkInDate), new Date(checkOutDate));
 return res.status(201).json(allRoomsAvailability)
});

const checkRoomAvailability = async (checkInDate, checkOutDate, roomId) => {
  const existingBooking = await Booking.findOne({
    room: new mongoose.Types.ObjectId(roomId),
    $or: [
      {
        $and: [
          { checkInTime: { $lt: checkOutDate } },
          { checkOutTime: { $gt: checkInDate } },
        ],
      },
      {
        $and: [
          { checkInTime: { $gte: checkInDate } },
          { checkInTime: { $lt: checkOutDate } },
        ],
      },
      {
        $and: [
          { checkOutTime: { $gt: checkInDate } },
          { checkOutTime: { $lte: checkOutDate } },
        ],
      },
    ],
  });

  if (!existingBooking) {
    return { message: "Room is available" };
  } else {
    return { message: "Room is not available" };
  }
};


router.get("/room-availability", async (req, res) => {
 let {checkInDate, checkOutDate, roomId} = req.query;
 const roomsAvailability = await checkRoomAvailability(new Date(checkInDate), new Date(checkOutDate), roomId);
 return res.status(201).json(roomsAvailability)
});

module.exports = router;
