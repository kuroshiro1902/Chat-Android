import { ApiRequest, ApiResponse } from '../../common/models/api.model';
import { serverError } from '../../errors';
import { EStatusCode } from '../../common/constants/status-code.constant';
import { Socket } from 'socket.io';
import messageService from '../../services/message.service';

class MessageController {
  async getMessages(req: ApiRequest, res: ApiResponse) {
    try {
      // @ts-ignore
      const { id: senderId } = req.user;
      // @ts-ignore
      const { options, receiverId } = req.body;
      if (!receiverId) {
        return res.status(EStatusCode.INVALID_INPUT).json({ isSuccess: false, message: 'Không có id người nhận!' });
      }
      const sendMessagesReq = messageService.getMessages(senderId, receiverId, options);
      const receiveMessagesReq = messageService.getMessages(receiverId, senderId, options);
      const messagesRes = await Promise.all([receiveMessagesReq, sendMessagesReq]);
      const messages = [...messagesRes[0], ...messagesRes[1]].sort((a, b) => b.sendTimestamp - a.sendTimestamp);
      return res.status(EStatusCode.SUCCESS).json({ isSuccess: true, data: messages });
    } catch (error) {
      console.error(error);
      serverError(res);
    }
  }

  async sendMessage(req: ApiRequest, res: ApiResponse) {
    try {
      // @ts-ignore
      const { id: senderId } = req.user;
      const { content, receiverId } = req.body;
      const response = await messageService.sendMessage({ senderId, content, receiverId });
      if (!response) {
        return res.status(EStatusCode.SERVER_ERROR).json({ isSuccess: false, message: 'Failed to send message!' });
      }
      const { status, isSuccess, data, message } = response;
      return res.status(status).json({ isSuccess, data, message });
    } catch (error) {
      console.error(error);
      serverError(res);
    }
  }
}

export default new MessageController();
