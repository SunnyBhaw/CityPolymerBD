import express from 'express';
import aboutUsRoutes from './aboutUs.route.js';
import contactUsRoutes from './contactUs.route.js';

const router = express.Router();

router.use('/about-us', aboutUsRoutes);
router.use('/contact-us', contactUsRoutes);

export default router;
