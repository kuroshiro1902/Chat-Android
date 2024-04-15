import { Router } from 'express';
import authController from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/auth.middleware';

// /auth
const authRouter = Router();

const routes = ['POST /signup', 'POST /login'];
authRouter.get('', (req, res) => {
  res.send(routes.reduce((prev, route) => prev + `<h1>${route}</h1>`, ''));
});
authRouter.post('/verify-token', authMiddleware, (req, res) => authController.verifyToken(req, res));
authRouter.post('/signup', (req, res) => authController.signup(req, res));
authRouter.post('/login', (req, res) => authController.login(req, res));

export default authRouter;
