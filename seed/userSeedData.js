const User = require("../model/User");
const mongoose = require("mongoose");
// Get apropriate database URI
const db = require("../config/db");

// Connect to the database
mongoose.connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("the connection with mongo is established");
    }
);

// Users dummy data
const users = [
    { name: "Faisal" },
    { name: "Haya" },
    { name: "Wejdan" },
    { name: "Ranen" },
    { name: "Sara" },
    { name: "Mohammed" },
    { name: "Usman" },
    { name: "Hisham" },
    { name: "Sager" },
    { name: "Osama" }
];
// Insert users array to the database
User.insertMany(users)
    .then(() => console.log("Data added"))
    .catch(err => console.log(err));
