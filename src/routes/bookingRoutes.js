import express from 'express';

import {
    createBooking,
    getAllBooking,
    updateBookingStatus
} from '../controllers/bookingController.js';
import { authenticateToken  } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.get('/', getAllBooking)
router.post('/:id/status', authenticateToken, updateBookingStatus)

export default router;
