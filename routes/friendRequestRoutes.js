const express = require('express');
const router = express.Router();
const FriendRequestController = require('../controllers/friendRequestController');
const authenticateUser = require('../middlewares/authMiddleware');

// Send a friend request
router.post('/send/:recipientId', authenticateUser, FriendRequestController.sendFriendRequest);

// Accept a friend request
router.put('/accept/:requestId', authenticateUser, FriendRequestController.acceptFriendRequest);

// Reject a friend request
router.put('/reject/:requestId', authenticateUser, FriendRequestController.rejectFriendRequest);

// Get friend requests for the authenticated user
router.get('/requests', authenticateUser, FriendRequestController.getFriendRequests);

module.exports = router;


