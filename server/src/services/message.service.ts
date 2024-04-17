import { EStatusCode } from '../common/constants/status-code.constant';
import { IMessage } from '../common/models/message.model';
import { IPagination } from '../common/models/pagination.model';
import apiService from './api.service';
import userService from './user.service';

export const messageDbPath = '/messages';
class MessageService {
  async getMessages(senderId: number, receiverId: number, options?: IPagination): Promise<IMessage[]> {
    try {
      let start: number = 0,
        end: number = 20;

      if (options?.pageIndex && options?.perPage) {
        start = (options.pageIndex - 1) * options?.perPage;
        end = options.pageIndex * options.perPage;
      }
      console.log(start, end);
      const { data: messages } = await apiService.get<IMessage[]>(messageDbPath, {
        senderId: [senderId, receiverId],
        receiverId: [receiverId, senderId],
        isDeleted: false,
        // _per_page: options?.perPage ?? 20,
        _start: start,
        _end: end,
        // _page: (() => {
        //   const pageIndex = options?.pageIndex;
        //   if (pageIndex && pageIndex >= 0) {
        //     return pageIndex;
        //   }
        //   return 1;
        // })(),
        _sort: options?.sortBy ?? 'id',
        _order: options?.order ?? 'desc',
      });
      console.log(messages?.length);

      if (messages && messages.length > 0) {
        return messages;
      } else return [];
    } catch (error) {
      return [];
    }
  }
  async sendMessage(message: {
    senderId: number;
    receiverId?: number;
    content?: string;
  }): Promise<{ isSuccess: boolean; message?: string; data?: IMessage; status: number } | null> {
    const { senderId, receiverId, content } = message;
    try {
      const validatedContent = this.validateContent(content);
      if (!validatedContent.data) {
        return {
          isSuccess: false,
          message: validatedContent.message,
          status: EStatusCode.INVALID_INPUT,
        };
      }

      if (!receiverId) {
        return {
          isSuccess: false,
          message: 'Không có id người nhận!',
          status: EStatusCode.INVALID_INPUT,
        };
      }

      const receiveUser = await userService.findById(receiverId);
      if (!receiveUser) {
        return {
          isSuccess: false,
          message: 'Không tồn tại người nhận!',
          status: EStatusCode.INVALID_INPUT,
        };
      }

      const message: IMessage = {
        content: validatedContent.data,
        receiverId,
        senderId,
        sendTimestamp: new Date().getTime(),
        isDeleted: false,
      };
      const createdMessage = await this.saveMessage(message);

      if (createdMessage) {
        return {
          isSuccess: true,
          data: createdMessage,
          status: EStatusCode.SUCCESS,
        };
      } else {
        return {
          isSuccess: false,
          message: 'Fail! Try again later.',
          status: EStatusCode.SERVER_ERROR,
        };
      }
    } catch (error) {
      return null;
    }
  }
  async deleteMessages(messageId: number): Promise<void> {
    try {
      await apiService.update(`${messageDbPath}/${messageId}`, { isDeleted: true });
    } catch (error) {
      console.error('Error deleting message:', error);
      throw new Error('Failed to delete message.');
    }
  }
  async saveMessage(message: IMessage) {
    try {
      const { content, receiverId, senderId } = message;
      const { data } = await apiService.post<IMessage>(messageDbPath, {
        content,
        receiverId,
        senderId,
        sendTimestamp: new Date().getTime(),
        isDeleted: false,
      });
      return data;
    } catch (error) {
      return null;
    }
  }

  private validateContent(content?: string): {
    data: string | null;
    message?: string;
  } {
    if (!content) {
      return { data: null, message: 'Message not found!' };
    }
    if (content.length > 10000) {
      return { data: null, message: 'Nội dung tin nhắn quá dài!' };
    } else {
      return {
        data: content,
        message: 'Success',
      };
    }
  }
}

export default new MessageService();
