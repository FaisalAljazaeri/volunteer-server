const Organization = require("../model/Organization");
const mongoose = require("mongoose");
const db = require("../config/db");
mongoose.connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("the connection with mongod is established");
    }
);
// Array of organization dummy data
const organizations = [
    { name: "Ekhaa" },
    { name: "contain" },
    { name: "Takatuf" },
    { name: "Sanad" },
    { name: "Bunyan" },
    { name: "King Abdulaziz Center for National Dialogue" }
];
// Insert organizations array to the database
Organization.insertMany(organizations)
    .then(() => console.log("Data added"))
    .catch(err => console.log(err));
