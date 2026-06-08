import express from 'express';
import {
  createAboutUs,
  getAllAboutUs,
  updateAboutUs,
} from '../controllers/aboutUs.controller.js';

const router = express.Router();

router.post('/create', createAboutUs);
router.get('/', getAllAboutUs);
router.put('/update/:id', updateAboutUs);

export default router;
