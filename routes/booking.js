const express = require("express");
const User = require("../models/User");
const Bookings = require("../models/Bookings");
const Room = require("../models/Rooms");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

router.post("/createbooking", fetchuser,async (req, res) => {
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

module.exports = router;
