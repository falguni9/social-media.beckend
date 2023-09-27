const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/messageController');
const authenticateUser = require('../middlewares/authMiddleware');

// Create a new message
router.post('/create', authenticateUser, MessageController.createMessage);

// Retrieve messages between two users
router.get('/:recipientId', authenticateUser, MessageController.getMessages);

module.exports = router;

