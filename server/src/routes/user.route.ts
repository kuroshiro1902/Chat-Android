import { Router } from 'express';
import userController from '../controllers/User/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const userRouter = Router();

// /users
// userRouter.use(authMiddleware);
userRouter.get('', (req, res) => userController.findOneById(req, res));

export default userRouter;
