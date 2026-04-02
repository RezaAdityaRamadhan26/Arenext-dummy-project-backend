import express from 'express';

import {
    createBooking,
    getAllBooking,
    updateBookingStatus,
    getMyBookings
} from '../controllers/bookingController.js';
import { authenticateToken  } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.get('/', getAllBooking)
router.get('/my-bookings', authenticateToken, getMyBookings)
router.post('/', authenticateToken, createBooking)
router.post('/:id/status', authenticateToken, updateBookingStatus)

export default router;
