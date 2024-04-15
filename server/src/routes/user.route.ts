import { Router } from 'express';
import userController from '../controllers/UserController';
import { authMiddleware } from '../middlewares/auth.middleware';

// /users
const userRouter = Router();

userRouter.get('/friends', authMiddleware, (req, res) => userController.getFriendsOfUser(req, res));
export default userRouter;
