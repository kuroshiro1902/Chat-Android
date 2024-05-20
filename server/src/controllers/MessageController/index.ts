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
      const messages = await messageService.getMessages(senderId, receiverId, options);
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
      const message = await messageService.sendMessage({ senderId, content, receiverId });
      if (!message) {
        return res.status(EStatusCode.SERVER_ERROR).json({ isSuccess: false, message: 'Failed to send message!' });
      }
      return res.status(EStatusCode.SUCCESS).json({ isSuccess: true, data: message });
    } catch (error) {
      console.error(error);
      serverError(res);
    }
  }

  async deleteMessages(req: ApiRequest, res: ApiResponse) {
    try {
      // @ts-ignore
      const { id: senderId } = req.user;
      // @ts-ignore
      const messageId = +(req.params.messageId as string);
      if (!messageId) {
        return res
          .status(EStatusCode.INVALID_INPUT)
          .json({ isSuccess: false, message: 'Không có id tin nhắn cần xóa!' });
      }
      const message = await messageService.getById(messageId);
      if (!message) {
        return res.status(EStatusCode.NOT_FOUND).json({ isSuccess: false, message: 'Tin nhắn không tồn tại.' });
      }
      if (message.senderId !== senderId) {
        return res
          .status(EStatusCode.UNAUTHORIZED)
          .json({ isSuccess: false, message: 'Bạn không có quyền xóa tin nhắn này!' });
      }
      const r = await messageService.deleteMessage(messageId);
      console.log({ r });

      return res.status(EStatusCode.SUCCESS).json({ isSuccess: true, data: r });
    } catch (error) {
      console.error(error);
      serverError(res);
    }
  }

  async deleteAllMessages(req: ApiRequest, res: ApiResponse) {
    try {
      // @ts-ignore
      const { id: selfId } = req.user;
      // @ts-ignore
      const friendId = +(req.params.friendId as string);
      if (!friendId) {
        return res.status(EStatusCode.INVALID_INPUT).json({ isSuccess: false, message: 'Không có id của bạn bè!' });
      }
      const messages = await messageService.deleteAllMessages(selfId, friendId);
      if (!messages) {
        return res.status(EStatusCode.NOT_FOUND).json({ isSuccess: false, message: 'Tin nhắn không tồn tại.' });
      }
      return res.status(EStatusCode.SUCCESS).json({ isSuccess: true, data: messages });
    } catch (error) {
      console.error(error);
      serverError(res);
    }
  }

  async hasReadMessage(req: ApiRequest, res: ApiResponse) {
    // Đã đọc message của ai gửi tới
    try {
      // @ts-ignore
      const { id: selfId } = req.user;
      const senderId = req.params.senderId;
      console.log({ senderId });

      if (!senderId) {
        return res.status(EStatusCode.INVALID_INPUT).json({ isSuccess: false, message: 'senderId is required!' });
      }

      const messages = await messageService.updateMessagesToRead(+senderId, +selfId);

      return res.status(EStatusCode.SUCCESS).json({ isSuccess: true, data: messages });
    } catch (error: any) {
      console.error(error);
      serverError(res, error.message);
    }
  }
}

export default new MessageController();
