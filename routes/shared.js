const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");
const Room = require("../models/Rooms");
const Booking = require("../models/Bookings");

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

module.exports = router;
