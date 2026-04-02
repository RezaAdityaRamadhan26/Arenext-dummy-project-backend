  import express from 'express';
  import { uploadVenueImage } from '../middlewares/uploadMiddleware.js';
  import {
    createVenue,
    getAllVenue,
    updateVenue,
    deleteVenue,
    getVenueById
  } from "../controllers/venueController.js";
  import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddlewares.js';

  const router = express.Router();

  router.get('/', getAllVenue)
  router.get('/:id', getVenueById)
  router.post('/', authenticateToken, authorizeAdmin, uploadVenueImage.single('image'), createVenue)

  router.put('/:id', authenticateToken, authorizeAdmin, uploadVenueImage.single('image'), updateVenue)
  router.delete('/:id', authenticateToken, authorizeAdmin, deleteVenue)

  export default router;  