import express from 'express';
import aboutUsRoutes from './aboutUs.route.js';
import contactUsRoutes from './contactUs.route.js';
import blogRoutes from './blog.route.js';

const router = express.Router();

router.use('/about-us', aboutUsRoutes);
router.use('/contact-us', contactUsRoutes);
router.use('/blogs', blogRoutes);

export default router;
