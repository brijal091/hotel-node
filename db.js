const mongoose = require("mongoose");

const db = "mongodb+srv://brijalk:brijal123@cluster0.gou2j7t.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(db)
.then(()=>console.log("Connection Successful"))
.catch((err)=>console.log(err));
