const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");
const Room = require("../models/Rooms");

// Route : 1 Create User
router.post("/createroom", async (req, res) => {
  const {
    roomNumber,
    roomName,
    capacity,
    amenities,
    price,
    availability,
    images,
    hotel
  } = req.body;
  // If errors occur return Bad req
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // check weather the user is already in database
  try {
    let room = await Room.findOne({ roomNumber, hotel });
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

// Define a route to fetch all rooms
router.get('/get-rooms', async (req, res) => {
    try {
      const rooms = await Room.find();
      res.json(rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
router.get('/:id', async (req, res) => {
  const {id} = req.params
    try {
      const room = await Room.findById(id);
      res.json(room);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
