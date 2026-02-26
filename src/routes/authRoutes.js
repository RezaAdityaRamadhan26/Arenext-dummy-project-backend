import express from 'express';
import { userRegist, userLogin } from '../controllers/authController.js'

const router = express.Router();
    
router.post('/register', userRegist)
router.post('/login', userLogin)

export default router;
