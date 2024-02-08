import { Router } from 'express';
import authRouter from './auth.route';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
router.use('/auth', authRouter);


export default router;
