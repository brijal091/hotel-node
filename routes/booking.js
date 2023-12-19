const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var fetchuser = require("../middleware/fetchuser");

router.post("/createbooking", async (req, res) => {
    const {
      roomNumber,
      payable_amount,
      checkIn,
      checkOut,
      checkOutTime,
      checkInTime,
      isPaymentDone
    } = req.body;
    // If errors occur return Bad req
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check weather the user is already in database
    try {
      let room = await Room.findOne({ roomNumber });
      if (room) {
        return res
          .status(400)
          .json({ error: "Room with this Room Number already exist." });
      }
  
      // Creating new user
      room = await Room.create({
        roomNumber,
        roomName,
        capacity,
        amenities,
        price,
        availability,
        images,
        hotel
      });
      
      res.json(room);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Something went Wrong");
    }
    // res.json({error: "Please Enter a Unique Value"})
  });

module.exports = router;
