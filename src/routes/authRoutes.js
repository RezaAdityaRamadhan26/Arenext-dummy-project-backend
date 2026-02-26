import express from 'express';
import { userRegist } from '../controllers/authController.js'

const router = express.Router();

router.post('/register', userRegist)

export default router;
