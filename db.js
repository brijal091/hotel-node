const mongoose = require("mongoose");

const db = "mongodb://localhost:27017/management"

mongoose.connect(db)
.then(()=>console.log("Connection Successful"))
.catch((err)=>console.log(err));
