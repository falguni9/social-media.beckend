const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authenticateUser = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerMiddleware'); // Multer for file uploads

// User registration
router.post('/register', UserController.registerUser);

// User login
router.post('/login', UserController.loginUser);

// Get user profile
router.get('/:userId', authenticateUser, UserController.getUserProfile);

// List users
router.get('/list', authenticateUser, UserController.listUsers);


// Update user profile
router.put('/:userId', authenticateUser, UserController.updateUserProfile);

// Upload profile picture
router.post('/upload/:userId', authenticateUser, upload.single('image'), UserController.uploadProfilePicture);

module.exports = router;
