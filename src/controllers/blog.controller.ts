import { Request, Response, NextFunction } from 'express';
import { Blog } from '../models';

export const getAllBlogPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const blogPosts = await Blog.findAll({
            order: [['created_at', 'DESC']],
        });

        res.status(200).json({
            success: true,
            data: blogPosts,
        });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        next(error);
    }
};

export const getBlogPostById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const { id } = req.params;
        const blogPost = await Blog.findByPk(id);

        if (!blogPost) {
            return res.status(404).json({
                success: false,
                message: 'Bài viết không tìm thấy.',
            });
        }

        res.status(200).json({
            success: true,
            data: blogPost,
        });
    } catch (error) {
        console.error('Error fetching blog post by ID:', error);
        next(error);
    }
};