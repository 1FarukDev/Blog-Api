import express, { Router } from 'express';
import authenticateMiddleware from '../middleware/authentication'
import {
    getAllBlogPosts,
    getSingleBlogPost,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    getAllBlogPostsByUser
} from '../controllers/blog';

const router: Router = Router();

router.route('/').get(getAllBlogPosts);

router.route('/').post(authenticateMiddleware, createBlogPost);
router.route('/:id')
    .get(getSingleBlogPost)
    .patch(authenticateMiddleware, updateBlogPost)
    .delete(authenticateMiddleware, deleteBlogPost);

router.route('/user/:authorId')
    .get(getAllBlogPostsByUser);

export default router;
