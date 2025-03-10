import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
} from '../controllers/postController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new post (Protected Route)
router.post('/', authMiddleware, createPost);

// Get all posts
router.get('/', getPosts);

// Get a single post by ID
router.get('/:id', getPostById);

// Update a post (Protected Route)
router.put('/:id', authMiddleware, updatePost);

// Delete a post (Protected Route)
router.delete('/:id', authMiddleware, deletePost);

// Add the like route
router.post('/like/:id', authMiddleware, likePost);

export default router;
