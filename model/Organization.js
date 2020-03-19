// Require necessary NPM packages
const mongoose = require('mongoose');

// Define Article Schema
const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: {type: String, required: true}
});

// Compile our Model based on the Schema
const Organization = mongoose.model('Organization', organizationSchema);

// Export our Model for use
module.exports = Organization;
