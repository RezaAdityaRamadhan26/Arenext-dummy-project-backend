import express from 'express';
import { userRegist, userLogin, verifyEmail } from '../controllers/authController.js'

const router = express.Router();
    
router.post('/register', userRegist)
router.post('/login', userLogin)
router.get('/verify-email', verifyEmail)

export default router;
