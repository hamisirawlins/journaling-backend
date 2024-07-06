import express from 'express';
import { login, signup, updatePassword, updateUserName } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);

//use middleware for password reset and update username
router.use(authMiddleware);
router.post('/updatePassword', authMiddleware, updatePassword);
router.post('/updateUserName', authMiddleware, updateUserName);


export default router;