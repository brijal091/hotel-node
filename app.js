const express = require("express");
const BookingDetails = require("./models/BookingDetails");
const Hotels = require("./models/Hotels");
const HotelCustomer = require("./models/HotelCustomers");
var bodyParser = require("body-parser");
require("./db");
const {
  // v1: uuidv1,
  v4: uuidv4,
} = require("uuid");
const app = express();
const port = 5000;

app.use(bodyParser.json());

app.post("/create-hotel", async (req, res) => {
  const { hotelName } = req.body;
  const hotelExist = await Hotel.findOne({ hotelName });
  if (hotelExist)
    return res
      .status(401)
      .json({ error: "Hotel with this Name already exist" });
  const newHotel = new Hotel({
    hotelName,
  });
  // Save the data in database
  let savedHotel = await newHotel.save();
  return res.status(201).send(savedHotel);
});

app.post("/create-customer", async (req, res) => {
  const { customerName, email, hotelName } = req.body;
  const customerExist = await HotelCustomer.findOne({ email });
  if (customerExist)
    return res
      .status(401)
      .json({ error: "User with this email already exist" });
  const newHotelCustomer = new HotelCustomer({
    customerName,
    email,
    hotelName,
  });
  // Save the data in database
  let savedCustomer = await newHotelCustomer.save();
  return res.status(201).send(savedCustomer);
});

// Create Document related to the booking details
app.post("/booking-details", async (req, res) => {
  const {
    customerName,
    email,
    hotelName,
    checkInTime,
    checkOutTime,
    bookingId,
    status,
  } = req.body;

  if (bookingId) {
    const BookingIdExist = await BookingDetails.findOne({ bookingId });
    if (BookingIdExist) {
      const bookingData = {
        customerName,
        email,
        hotelName,
        checkInTime,
        checkOutTime,
        bookingId,
        status,
      };
      // console.log("I am here", bookingData)
      const booking = await BookingDetails.findOneAndUpdate(
        { bookingId },
        { $set: bookingData },
        { new: true }
      );
      return res.json({ booking });
      // return res
      //   .status(200)
      //   .json({ error: "Booking Details updated successfully" });
    }
    return res.json({ error: "Booking Id Does not exist" });
  } else {
    const newBookingId = uuidv4();
    const newBooking = new BookingDetails({
      customerName,
      email,
      hotelName,
      bookingId: newBookingId,
      status,
      checkInTime,
      checkOutTime,
    });
    // Save the data in database
    let saveBooking = await newBooking.save();
    return res.status(201).send(saveBooking);
  }
});

app.get("/search", async (req, res) => {
  try {
    const { status, name, hotel, email } = req.query;
    const queryToSearch = {};
    if (status) {
      queryToSearch.status = status;
    }
    if (name) {
      queryToSearch.customerName = name;
    }
    if (hotel) {
      queryToSearch.hotelName = hotel;
    }
    if (email) {
      queryToSearch.email = email;
    }
    console.log("Check your query", queryToSearch);
    const result = await BookingDetails.find(queryToSearch).lean();
    console.log();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
