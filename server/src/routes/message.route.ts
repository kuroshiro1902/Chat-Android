import { Router } from 'express';
import messageController from '../controllers/MessageController';
import { authMiddleware } from '../middlewares/auth.middleware';

// /messages
const messageRouter = Router();

//@ts-ignore
messageRouter.use(authMiddleware);
messageRouter.post('/get-messages', (req, res) => messageController.getMessages(req, res));
messageRouter.post('/send-message', (req, res) => messageController.sendMessage(req, res));
messageRouter.delete('/delete-message/:messageId', (req, res) => messageController.deleteMessages(req, res));

export default messageRouter;
