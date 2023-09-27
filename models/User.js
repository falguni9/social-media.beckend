const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String, // User's name
  bio: String, // User's bio
  profilePicture: String, // Store the profile picture as a URL
  // List of friends
  friends: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }], 

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  // Add more fields for user details like name, location, etc.
  // Add fields for user followers and following (e.g., an array of user IDs).
});

const User = mongoose.model('User', userSchema);

module.exports = User;
