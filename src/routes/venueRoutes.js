import express from 'express';
import { uploadVenueImage } from '../middlewares/uploadMiddleware.js';
import {
  createVenue,
  getAllVenue,
  updateVenue,
  deleteVenue,
} from "../controllers/venueController.js";
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', getAllVenue)
router.post('/', authenticateToken, authorizeAdmin, uploadVenueImage.single('image'), createVenue)

router.put('/:id', updateVenue)
router.delete('/:id', deleteVenue)

export default router;