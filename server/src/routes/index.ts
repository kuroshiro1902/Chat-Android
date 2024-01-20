import { Router } from 'express';
import authRouter from './auth.route';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
router.use('/auth', authRouter);
// router.use('/api/posts', authMiddleware, postRouter);


export default router;
