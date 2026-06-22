import express from 'express';
import { imageUpload } from '../middleware/upload.middleware.js';
import {
  createConcern,
  updateConcern,
  deleteConcern,
  toggleConcernStatus,
  getAllConcerns,
  getConcernById,
} from '../controllers/concern.controller.js';

const router = express.Router();

router.post('/', imageUpload.single('logo'), createConcern);
router.put('/:id', imageUpload.single('logo'), updateConcern);
router.delete('/:id', deleteConcern);
router.patch('/:id/toggle-status', toggleConcernStatus);
router.get('/', getAllConcerns);
router.get('/:id', getConcernById);

export default router;
