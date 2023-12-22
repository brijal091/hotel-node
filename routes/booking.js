const express = require("express");
const User = require("../models/User");
const Bookings = require("../models/Bookings");
const Room = require("../models/Rooms");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

router.post("/createbooking", fetchuser, async (req, res) => {
  const {
    room,
    payable_amount,
    checkIn,
    checkOut,
    checkOutTime,
    checkInTime,
    isPaymentDone,
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let booking = await Bookings.create({
      room,
      user: req.user.id,
      payable_amount,
      checkIn,
      checkOut,
      checkOutTime: checkOutTime,
      checkInTime: checkInTime,
      isPaymentDone,
    });

    res.json(booking);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Something went Wrong");
  }
  // res.json({error: "Please Enter a Unique Value"})
});

router.put("/updatebooking/:id", fetchuser, async (req, res) => {
  const { id } = req.params;
  const {
    room,
    payable_amount,
    checkIn,
    checkOut,
    checkOutTime,
    checkInTime,
    isPaymentDone,
  } = req.body;

  // Check if the room is available for the specified duration
  const isRoomAvailable = await checkRoomAvailability(
    room,
    new Date(checkInTime),
    new Date(checkOutTime),
    id
  );
  if (!isRoomAvailable) {
    return res
      .status(400)
      .json({ error: "Room not available for the specified duration" });
  }

  const updatedBooking = {};
  if (room) {
    updatedBooking.room = room;
  }
  if (payable_amount) {
    updatedBooking.payable_amount = payable_amount;
  }
  if (checkIn) {
    updatedBooking.checkIn = checkIn;
  }
  if (checkOut) {
    updatedBooking.checkOut = checkOut;
  }
  if (checkOutTime) {
    updatedBooking.checkOutTime = checkOutTime;
  }
  if (checkInTime) {
    updatedBooking.checkInTime = checkInTime;
  }
  if (isPaymentDone) {
    updatedBooking.isPaymentDone = isPaymentDone;
  }

  let booking = await Bookings.findById(req.params.id);
  if (!booking) {
    return res.status(404).send("Not Found");
  }
  if (booking.user.toString() !== req.user.id) {
    return res.status.send(401).send("Not allowed");
  }
  // Here new: true means that if any new object is added to that note than it will be created
  booking = await Bookings.findByIdAndUpdate(
    req.params.id,
    { $set: updatedBooking },
    { new: true }
  );
  res.json({ booking });
});

// Function to check room availability
async function checkRoomAvailability(
  roomId,
  checkInTime,
  checkOutTime,
  bookingId
) {
  console.log(roomId, checkInTime, checkOutTime, bookingId)
  const existingBooking = await Bookings.findOne({
    room: roomId,
    _id: { $ne: bookingId }, // Exclude the current booking from consideration
    $or: [
      {
        checkInTime: { $lt: checkOutTime },
        checkOutTime: { $gt: checkInTime },
      },
      { checkInTime: { $gte: checkInTime, $lt: checkOutTime } },
      { checkOutTime: { $gt: checkInTime, $lte: checkOutTime } },
    ],
  });
  return !existingBooking; // Room is available if no overlapping booking is found
}

module.exports = router;
