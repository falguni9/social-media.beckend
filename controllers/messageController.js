const Message = require('../models/message');
const User = require('../models/user'); // Import the User model

const MessageController = {
  // Create a new message
  createMessage: async (req, res) => {
    try {
      const { userId } = req;
      const { recipientId, content } = req.body;

      // Validate recipientId (ensure that the recipient exists)
      const recipientExists = await User.exists({ _id: recipientId });
      if (!recipientExists) {
        return res.status(400).json({ message: 'Recipient not found' });
      }

      const message = new Message({
        sender: userId,
        recipient: recipientId,
        content,
      });

      await message.save();

      res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Retrieve messages between two users
  getMessages: async (req, res) => {
    try {
      const { userId } = req;
      const { recipientId } = req.params;

      // Retrieve messages exchanged between the two users
      const messages = await Message.find({
        $or: [
          { sender: userId, recipient: recipientId },
          { sender: recipientId, recipient: userId },
        ],
      }).sort('timestamp');

      res.status(200).json({ messages });
    } catch (error) {
      console.error('Error retrieving messages:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = MessageController;

