import { EStatusCode } from '../common/constants/status-code.constant';
import { IApiResponse } from '../common/models/api.model';
import { IMessage } from '../common/models/message.model';
import { IPagination } from '../common/models/pagination.model';
import apiService from './api.service';
import userService from './user.service';

export const messageDbPath = '/messages';
class MessageService {
  async getById(messageId: number) {
    const { data: message } = await apiService.get<IMessage | undefined>(`${messageDbPath}/${messageId}`);
    return message;
  }
  async getMessages(
    senderId: number,
    receiverId: number,
    options?: IPagination,
    fieldOptions?: Partial<IMessage>,
  ): Promise<IMessage[]> {
    console.log({ options });

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
        ...fieldOptions,
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
        isRead: false,
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
      return { isSuccess: false, message: 'Fail! Try again later.', status: 500 };
    }
  }
  async deleteMessage(messageId: number) {
    try {
      const { data, status } = await apiService.update(`${messageDbPath}/${messageId}`, {
        isDeleted: true,
        modifyTimestamp: new Date().getTime(),
      });
      if (data?.isDeleted) {
        return {
          isSuccess: true,
          message: 'Delete successfully!',
          status,
        };
      } else {
        return {
          isSuccess: false,
          message: 'Delete failed!',
          status,
        };
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      return {
        isSuccess: false,
        message: 'Delete failed!',
        status: 500,
      };
    }
  }

  async updateMessages(
    senderId: number,
    receiverId: number,
    patchValue: Partial<IMessage>,
    conditions?: Partial<IMessage>,
  ) {
    try {
      const { data: messages } = await apiService.get<IMessage[]>(messageDbPath, {
        senderId,
        receiverId,
        ...conditions,
      });
      const requests = messages.map((m) => apiService.update<IMessage>(`${messageDbPath}/${m.id}`, patchValue));
      const responses = (await Promise.all(requests)).map((r) => r.data);
      return {
        isSuccess: true,
        data: responses,
        status: EStatusCode.SUCCESS,
      };
    } catch (error: any) {
      console.error(error);
      return {
        isSuccess: false,
        data: [],
        message: error.message,
        status: EStatusCode.SERVER_ERROR,
      };
    }
  }

  async saveMessage(message: IMessage) {
    try {
      const { data } = await apiService.post<IMessage>(messageDbPath, message);
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
