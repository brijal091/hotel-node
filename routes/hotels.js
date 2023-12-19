const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var fetchuser = require("../middleware/fetchuser");
const Hotels = require("../models/Hotels");
const Rooms = require("../models/Rooms");
const mongoose = require("mongoose");

// Route : 1 Create Hotel
router.post(
  "/create-hotel",
  body("hotelName", "Hostname is required").notEmpty(),
  async (req, res) => {
    const result = validationResult(req);
    if (result.errors.length > 0) {
      return res.status(400).json({ errors: result.errors });
    }
    const {
      hotelCode,
      hotelName,
      location,
      address,
      facilities,
      email,
      phone,
    } = req.body;
    const hotelExist = await Hotels.findOne({ hotelCode });
    if (hotelExist)
      return res
        .status(401)
        .json({ error: "Hotel with this code already exist" });
    const newHotel = new Hotels({
      hotelCode,
      hotelName,
      location,
      address,
      facilities,
      email,
      phone,
    });
    // Save the data in database
    let savedHotel = await newHotel.save();
    return res.status(201).send(savedHotel);
  }
);

// Define a route to fetch all rooms
router.get("/get-hotels", async (req, res) => {
  try {
    const hotels = await Hotels.find();
    res.json(hotels);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const hotelWithRooms = await Hotels.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(id) }, // Match the specific hotel
        },
        {
          $lookup: {
            from: "rooms",
            localField: "_id",
            foreignField: "hotel",
            as: "rooms",
          },
        },
      ]);
      console.log(hotelWithRooms);
      res.json(hotelWithRooms);
    } catch (error) {
      console.error("Error fetching hotel:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
