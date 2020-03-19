// Require necessary NPM packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// Require Route Files
const userRouter = require('./routes/user');
const organizationRouter = require('./routes/organization');
const postRouter = require('./routes/post');

// Require DB Configuration File
const db = require('./config/db');

// Establish Database Connection
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
  console.log('Connected to Mongo');
});



// Instantiate Express Application Object
const app = express();

// Define PORT for the API to run on
const port = process.env.PORT || 5000;
const reactPort = 3000;


/*** Middleware ***/


// Use envieronemnt variables from .env file
dotenv.config();
// Middleware
app.use(cookieParser());

// Add `bodyParser` middleware which will parse JSON requests
// into JS objects before they reach the route files.
//
// The method `.use` sets up middleware for the Express application
app.use(express.json());


// Set CORS headers on response from this API using the `cors` NPM package.
app.use(cors({ credentials: true }))

// Mount imported Routers
app.use(userRouter);
app.use(organizationRouter);
app.use(postRouter);

// Start the server to listen for requests on a given port
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});