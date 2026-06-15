import express from 'express';
import aboutUsRoutes from './aboutUs.route.js';
import contactUsRoutes from './contactUs.route.js';
import blogRoutes from './blog.route.js';
import concernRoutes from './concern.route.js';
import bannerRoutes from './banner.route.js';

const router = express.Router();

router.use('/about-us', aboutUsRoutes);
router.use('/contact-us', contactUsRoutes);
router.use('/blogs', blogRoutes);
router.use('/concerns', concernRoutes);
router.use('/banners', bannerRoutes);

export default router;
