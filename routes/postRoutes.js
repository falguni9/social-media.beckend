const express = require('express');
const router = express.Router();
const PostController = require('../controllers/postController');
const UserController = require('../controllers/userController'); // Add this line to import the UserController
const authenticateUser = require('../middlewares/authMiddleware');

// Create a post
router.post('/create', authenticateUser, PostController.createPost);

// Retrieve posts from user's friends and followers
router.get('/feed', authenticateUser, PostController.getFeed);

// Get user profiles for tagging in posts
router.get('/user-profiles', authenticateUser, UserController.getUserProfiles);

module.exports = router;
