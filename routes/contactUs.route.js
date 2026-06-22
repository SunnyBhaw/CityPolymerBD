import express from 'express';
import {
  createContactUs,
  getAllContactUs,
  updateContactUs,
} from '../controllers/contactUs.controller.js';

const router = express.Router();

router.post('/create', createContactUs);
router.get('/', getAllContactUs);
router.put('/update/:id', updateContactUs);

export default router;
