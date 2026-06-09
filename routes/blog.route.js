import express from 'express';
import { imageUpload } from '../middleware/upload.middleware.js';
import {
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
} from '../controllers/blog.controller.js';

const router = express.Router();

router.post('/', imageUpload.single('thumbnail'), createBlog);
router.put('/:id', imageUpload.single('thumbnail'), updateBlog);
router.delete('/:id', deleteBlog);
router.patch('/:id/publish', publishBlog);
router.patch('/:id/unpublish', unpublishBlog);
router.get('/', getAllBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.get('/:id', getBlogById);

export default router;
