import express from 'express';
import { createVenue} from '../controllers/venueController.js'

const router = express.Router();

router.post('/', createVenue)

export default router;