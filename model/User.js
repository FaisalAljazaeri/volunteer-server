// Require necessary NPM packages
const mongoose = require('mongoose');

// Define Article Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: {type: String, required: true}
});

// Compile our Model based on the Schema
const User = mongoose.model('User', userSchema);

// Export our Model for use
module.exports = User;
