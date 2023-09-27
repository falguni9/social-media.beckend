const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/config'); // Store your secret key securely

const UserController = {
  registerUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check if the email or username is already in use
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });

      if (existingUser) {
        return res.status(400).json({ message: 'Email or username is already in use' });
      }

      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check if the provided password matches the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Create a JWT token for the authenticated user
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

      res.status(200).json({ message: 'Log In successful', token, userId: user._id });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getUserProfile: async (req, res) => {
    try {
      const { userId } = req.params;

      // Ensure the requested user is the authenticated user
      if (userId !== req.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  updateUserProfile: async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body; // Include fields like username, email, bio, etc.

      // Ensure the requested user is the authenticated user
      if (userId !== req.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      await User.findByIdAndUpdate(userId, updates);

      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  uploadProfilePicture: async (req, res) => {
    try {
      const { userId } = req.params;
      const imageUrl = req.body.imageUrl; // Assuming you send the image URL in the request body

      // Ensure the requested user is the authenticated user
      if (userId !== req.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Update the profilePicture field in the User model with the provided image URL
      await User.findByIdAndUpdate(userId, { profilePicture: imageUrl });

      res.status(200).json({ message: 'Profile picture URL updated successfully' });
    } catch (error) {
      console.error('Error updating profile picture URL:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

    // Get a list of users
    listUsers: async (req, res) => {
      try {
        // Retrieve a list of users excluding the currently authenticated user
        const users = await User.find({ _id: { $ne: req.userId } }, 'username');
  
        res.status(200).json({ users });
      } catch (error) {
        console.error('Error listing users:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    },
  // Get user profiles for tagging in posts
  getUserProfiles: async (req, res) => {
    try {
      // Retrieve a list of user profiles (e.g., username and name)
      const users = await User.find({}, 'username name');

      res.status(200).json({ users });
    } catch (error) {
      console.error('Error retrieving user profiles:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
 
};

module.exports = UserController;
