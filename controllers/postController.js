const User = require('../models/user');
const Post = require('../models/post');

const PostController = {
  // Create a post
  createPost: async (req, res) => {
    try {
      const { userId } = req;
      const { content, images, videos, tags } = req.body;

      // Create a new post
      const post = new Post({
        user: userId,
        content,
        images,
        videos,
        tags,
      });

      await post.save();

      // Update the user's posts array
      await User.findByIdAndUpdate(userId, { $push: { posts: post._id } });

      res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Retrieve posts from user's friends and followers
  getFeed: async (req, res) => {
    try {
      const { userId } = req;

      // Retrieve the user's friends
      const user = await User.findById(userId).populate('friends', 'posts');

      // Get posts from user's friends
      const friendPosts = user.friends
        .map((friend) => friend.posts)
        .flat()
        .filter((postId) => postId); // Filter out null values

      // Get the user's own posts
      const userPosts = await Post.find({ user: userId });

      // Combine and sort posts chronologically
      const allPosts = [...userPosts, ...friendPosts].sort(
        (a, b) => b.createdAt - a.createdAt
      );

      res.status(200).json({ posts: allPosts });
    } catch (error) {
      console.error('Error retrieving feed:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = PostController;


