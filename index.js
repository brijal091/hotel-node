const express = require('express');
var cors = require('cors')
require("./db")

const app = express()
const port = 5000

app.use(cors())

// Middle ware 
app.use(express.json())

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/room', require('./routes/rooms'))
app.use('/api/bookings', require('./routes/booking'))
app.use('/api/hotels', require('./routes/hotels'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})