import { Router } from 'express';
import userController from '../controllers/UserController';
import { authMiddleware } from '../middlewares/auth.middleware';

// /users
const userRouter = Router();

userRouter.use(authMiddleware);
userRouter.get('/friends', (req, res) => userController.getFriendsOfUser(req, res));
userRouter.get('/search', (req, res) => userController.searchFriends(req, res));
userRouter.get('/id/:userId', (req, res) => userController.getUserById(req, res));
userRouter.get('/friend-request/:receiverId', (req, res) => userController.getFriendRequest(req, res));
userRouter.get('/all-acceptances/', (req, res) => userController.getAllAcceptances(req, res));
userRouter.post('/add-friend/:receiverId', (req, res) => userController.addFriend(req, res));
userRouter.post('/accept/:friendReqId', (req, res) => userController.acceptFriendRequest(req, res));
export default userRouter;
