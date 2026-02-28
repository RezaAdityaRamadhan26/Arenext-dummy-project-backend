import express from 'express';
import {
  createVenue,
  getAllVenue,
  updateVenue,
  deleteVenue,
} from "../controllers/venueController.js";
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/', createVenue)
router.get('/', getAllVenue)
router.post('/', authenticateToken, authorizeAdmin)

router.put('/:id', updateVenue)
router.delete('/:id', deleteVenue)

export default router;