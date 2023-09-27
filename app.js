const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const http = require('http');
const dbConnection = require('./config/Db.config')
const socketIo = require('socket.io');

const cors = require('cors');
app.use(cors());
// Middleware for parsing JSON requests


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Import routes for User, FriendRequest, Post, and Message
const userRoutes = require('./routes/userRoute');
const friendRequestRoutes = require('./routes/friendRequestRoutes');
const postRoutes = require('./routes/postRoutes');
const messageRoutes = require('./routes/messageRoutes'); // Import the Message routes

// Import Multer middleware for profile picture upload
const upload = require('./middlewares/multerMiddleware');



// Use the routes
app.use('/api/user', userRoutes);
app.use('/api/friend-request', friendRequestRoutes);
app.use('/api/post', postRoutes);
app.use('/api/message', messageRoutes); // Use the Message routes

// Serve uploaded profile pictures
app.use('/uploads', express.static('uploads'));

// Set up Socket.io
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  // Handle socket events here
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  dbConnection
});
