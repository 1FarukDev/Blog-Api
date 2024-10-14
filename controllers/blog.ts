import express, { Request, Response, NextFunction } from 'express';
import Blog from '../models/Blog';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        name: string;
    };
}

const getAllBlogPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const blogs = await Blog.find({});
        res.status(StatusCodes.OK).json({ blogs, count: blogs.length });
    } catch (error) {
        next(error);
    }
};

const getSingleBlogPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
            const error = new Error('Blog post not found') as any;
            error.statusCode = StatusCodes.NOT_FOUND;
            throw error;
        }
        res.status(StatusCodes.OK).json({ blog });
    } catch (error) {
        next(error);
    }
};

const createBlogPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user || !req.user.userId) {
            const error = new Error('Unauthorized') as any;
            error.statusCode = StatusCodes.UNAUTHORIZED;
            throw error;
        }
        req.body.authorId = req.user.userId;
        const blog = await Blog.create(req.body);
        res.status(StatusCodes.CREATED).json({ blog });
    } catch (error) {
        next(error);
    }
};

const updateBlogPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params
        const { userId } = req.user || {}
        if (!userId) {
            const error = new Error('Unauthorized') as any;
            error.statusCode = StatusCodes.UNAUTHORIZED;
            throw error;
        }
        const blog = await Blog.findOneAndUpdate(
            { _id: id, authorId: userId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!blog) {
            const error = new Error('Blog post not found or you are not authorized to update it') as any;
            error.statusCode = StatusCodes.NOT_FOUND;
            throw error;
        }
        res.status(StatusCodes.OK).json({ blog });
    } catch (error) {
        next(error)
    }

};

const deleteBlogPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { userId } = req.user || {};

        if (!userId) {
            const error = new Error('Unauthorized') as any;
            error.statusCode = StatusCodes.UNAUTHORIZED;
            throw error;
        }


        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('Invalid blog post ID') as any;
            error.statusCode = StatusCodes.BAD_REQUEST;
            throw error;
        }

        const blog = await Blog.findOneAndDelete({ _id: id, authorId: userId });

        if (!blog) {
            const error = new Error('Blog post not found or you are not authorized to delete it') as any;
            error.statusCode = StatusCodes.NOT_FOUND;
            throw error;
        }

        res.status(StatusCodes.OK).json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        next(error);
    }
};


export {
    getAllBlogPosts,
    getSingleBlogPost,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost
};