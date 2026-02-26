import express from 'express';

import {
    createBooking,
    getAllBooking,
    updateBookingStatus
} from '../controllers/bookingController.js';

const router = express.Router()

router.post('/', createBooking)
router.get('/', getAllBooking)
router.put('/:id/status', updateBookingStatus)

export default router;
