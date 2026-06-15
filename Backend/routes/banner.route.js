import express from 'express';
import { imageUpload } from '../middleware/upload.middleware.js';
import {
  createBanner,
  updateBanner,
  deleteBanner,
  getAllBanners,
  getBannerById,
} from '../controllers/banner.controller.js';

const router = express.Router();

router.post('/', imageUpload.single('image'), createBanner);
router.put('/:id', imageUpload.single('image'), updateBanner);
router.delete('/:id', deleteBanner);
router.get('/', getAllBanners);
router.get('/:id', getBannerById);

export default router;
