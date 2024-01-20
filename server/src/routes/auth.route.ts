import { Router } from 'express';
import authController from '../controllers/Auth/auth.controller';

const authRouter = Router();

// users/auth
authRouter.post('/signup', (req, res) => authController.signup(req, res));
authRouter.post('/login', (req, res) => authController.login(req, res));

export default authRouter;
