// Require necessary NPM packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Article Schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  photo:{type:String ,default:"https://cdn.pixabay.com/photo/2017/02/10/12/12/volunteer-2055043__340.png"},
  description:{ type: String, required: true},
  place:{type:String, required: true },
  organization:  {
    type: Schema.Types.ObjectId,
    ref: "Organization"
},
users:[
  {
    type: Schema.Types.ObjectId,
    ref: "User"
}]
});

// Compile our Model based on the Schema
const Post = mongoose.model('Post', postSchema);

// Export our Model for use
module.exports = Post;