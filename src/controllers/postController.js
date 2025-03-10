import Post from '../models/Post.js';

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({ title, content, author: req.user.userId });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
};

// Get all posts
export const getPosts = async (req, res) => {
  const { page = 1, limit = 6 } = req.query;
  try {
    const totalPosts = await Post.countDocuments();
    const posts = await Post.find()
      .skip((page - 1) * limit)  // Skip posts based on the current page
      .limit(Number(limit))// Limit the number of posts per page
      .populate('author', 'username email') ;  

    const totalPages = Math.ceil(totalPosts / limit);

    res.json({ posts, totalPages });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts." });
  }
};


// Get a single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username email');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check if the logged-in user is the author of the post
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check if the logged-in user is the author of the post
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
}
// Like a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check if the user has already liked the post
    if (post.likes.includes(req.user.userId)) {
      return res.status(400).json({ message: 'You already liked this post' });
    }

    // Add the user to the likes array
    post.likes.push(req.user.userId);
    await post.save();

    res.json({ likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error });
  }
};
