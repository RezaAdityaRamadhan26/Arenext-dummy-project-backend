import express from 'express';
import {
  createVenue,
  getAllVenue,
  updateVenue,
  deleteVenue,
} from "../controllers/venueController.js";

const router = express.Router();

router.post('/', createVenue)
router.get('/', getAllVenue)

router.put('/:id', updateVenue)
router.delete('/:id', deleteVenue)

export default router;