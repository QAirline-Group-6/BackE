import express from 'express';
import { getAllBlogPosts, getBlogPostById } from '../../controllers/blog.controller';

const router = express.Router();

// Get all blog posts
router.get('/', getAllBlogPosts);

// Get blog post by ID
router.get('/:id', getBlogPostById as express.RequestHandler);

export default router;