import { Router } from 'express';
import userController from '../controllers/UserController';
import { authMiddleware } from '../middlewares/auth.middleware';

// /users
const userRouter = Router();

userRouter.get('/friends', authMiddleware, (req, res) => userController.getFriendsOfUser(req, res));
userRouter.get('/search', authMiddleware, (req, res) => userController.searchFriends(req, res));
userRouter.get('/id/:userId', authMiddleware, (req, res) => userController.getUserById(req, res));
export default userRouter;
