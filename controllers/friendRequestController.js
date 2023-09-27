const FriendRequest = require('../models/friendRequest');
const User = require('../models/user');

const FriendRequestController = {
  sendFriendRequest: async (req, res) => {
    try {
      const { recipientId } = req.params;
      const { userId } = req;

      // Check if a friend request from the sender to the recipient already exists
      const existingRequest = await FriendRequest.findOne({
        sender: userId,
        recipient: recipientId,
      });

      if (existingRequest) {
        return res.status(400).json({ message: 'Friend request already sent' });
      }

      // Create a new friend request
      const friendRequest = new FriendRequest({
        sender: userId,
        recipient: recipientId,
      });

      await friendRequest.save();

      res.status(201).json({ message: 'Friend request sent successfully' });
    } catch (error) {
      console.error('Error sending friend request:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  acceptFriendRequest: async (req, res) => {
    try {
      const { requestId } = req.params;
      const { userId } = req;

      const friendRequest = await FriendRequest.findById(requestId);
        console.log(friendRequest)
      if (!friendRequest) {
        return res.status(404).json({ message: 'Friend request not found' });
      }

      // Check if the recipient is the authenticated user
      if (friendRequest.recipient.toString() !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Update the friend request status to 'accepted'
      friendRequest.status = 'accepted';
      await friendRequest.save();

      // Add each user to the other's friend list
      const senderId = friendRequest.sender.toString();
      const recipientId = friendRequest.recipient.toString();

      // Update the sender's friend list
      await User.findByIdAndUpdate(senderId, { $push: { friends: recipientId } });

      // Update the recipient's friend list
      await User.findByIdAndUpdate(recipientId, { $push: { friends: senderId } });

      res.status(200).json({ message: 'Friend request accepted successfully' });
    } catch (error) {
      console.error('Error accepting friend request:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  rejectFriendRequest: async (req, res) => {
    try {
      const { requestId } = req.params;
      const { userId } = req;

      const friendRequest = await FriendRequest.findById(requestId);

      if (!friendRequest) {
        return res.status(404).json({ message: 'Friend request not found' });
      }

      // Check if the recipient is the authenticated user
      if (friendRequest.recipient.toString() !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Update the friend request status to 'rejected'
      friendRequest.status = 'rejected';
      await friendRequest.save();

      res.status(200).json({ message: 'Friend request rejected successfully' });
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  getFriendRequests: async (req, res) => {
    try {
      const { userId } = req;
  
      // Find all pending friend requests where the user is the recipient
      const friendRequests = await FriendRequest.find({
        recipient: userId,
        status: 'pending',
      })
        .populate('sender', 'username') // Populate sender's username
        .sort({ createdAt: -1 });
  
      res.status(200).json({ friendRequests });
    } catch (error) {
      console.error('Error retrieving friend requests:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
};

module.exports = FriendRequestController;

