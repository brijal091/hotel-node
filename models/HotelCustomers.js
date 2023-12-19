const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  hotelName: {
    type: String,
    required: true
  }
}, {
    timestamps: true
});

module.exports = mongoose.model("Customer", CustomerSchema);
