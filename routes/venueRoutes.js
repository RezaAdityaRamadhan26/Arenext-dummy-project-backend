import express from 'express';
import { createVenue} from './venueController.js'

const router = express.Router

router.post('/', createVenue)

export default router;