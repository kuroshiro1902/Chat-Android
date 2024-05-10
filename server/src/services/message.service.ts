import { EStatusCode } from '../common/constants/status-code.constant';
import { IApiResponse } from '../common/models/api.model';
import { IMessage } from '../common/models/message.model';
import { IPagination } from '../common/models/pagination.model';
import { db } from '../database';
import apiService from './api.service';
import Service from './service';
import userService from './user.service';

export const messageDbPath = '/messages';

const transform = (message: any): IMessage | undefined => {
  if (!message) return undefined;
  return {
    id: message.id,
    content: message.content,
    receiverId: message.receiverid ?? message.receiverId,
    senderId: message.senderid ?? message.senderId,
    sendTimestamp: message.sendtimestamp ?? message.sendTimestamp,
    isRead: message.isread ?? message.isRead,
    isDeleted: message.isdeleted ?? message.isDeleted,
  };
};
class MessageService extends Service {
  async getById(messageId: number) {
    const message = await this.queryOne<IMessage>(
      `
      SELECT * FROM messages WHERE id = $1
    `,
      [+messageId],
    );
    return transform(message);
  }

  async getMessages(
    senderId: number,
    receiverId: number,
    options?: IPagination,
    fieldOptions?: Partial<IMessage>,
  ): Promise<IMessage[]> {
    const pageIndex = options?.pageIndex ?? 1;
    const perPage = options?.perPage ?? 20;
    const sortBy = options?.sortBy ?? 'id';
    const order = options?.order ?? 'desc';
    console.log({ pageIndex, perPage, sortBy, order });
    const messages = await this.query<IMessage>(
      `
      SELECT *
      FROM messages
      WHERE 
        isDeleted = false
        AND (
          (senderId = $1 AND receiverId = $2)
          OR
          (receiverId = $1 AND senderId = $2)
        )
      ORDER BY ${sortBy} ${order}
      OFFSET $3 LIMIT $4;      
      `,
      [+senderId, +receiverId, +pageIndex - 1, +perPage],
    );
    if (!messages || messages.length === 0) {
      return [];
    }
    return messages.map((m) => transform(m)!);
  }
  async sendMessage(message: { senderId: number; receiverId?: number; content?: string }) {
    const { senderId, receiverId, content } = message;
    const validatedContent = this.validateContent(content);
    if (!validatedContent.data) {
      throw new Error('Content not validated');
    }

    if (!receiverId) {
      throw new Error('Không có id người nhận!');
    }

    // const receiveUser = await userService.findById(receiverId);
    // if (!receiveUser) {
    //   throw new Error('Không tồn tại người nhận!');
    // }

    const _message: IMessage = {
      content: validatedContent.data,
      receiverId,
      senderId,
      sendTimestamp: new Date().getTime(),
      isRead: false,
      isDeleted: false,
    };
    const createdMessage = await this.saveMessage(_message);
    return transform(createdMessage);
  }

  async deleteMessage(messageId: number) {
    const data = await this.queryOne<IMessage>(
      `
        UPDATE messages SET isDeleted = $1 WHERE id = $2 RETURNING *;
      `,
      [true, +messageId],
    );

    return transform(data);
  }

  async updateMessagesToRead(senderId: number, receiverId: number) {
    const messages = await this.query<IMessage>(
      `
        UPDATE messages 
        SET isRead = true
        WHERE isRead = false
        AND (senderId = $1 AND receiverId = $2)
        -- OR (senderId = $2 AND receiverId = $1)
        RETURNING *;
      `,
      [+senderId, +receiverId],
    );
    return messages.map((m) => transform(m)!);
  }

  async saveMessage(message: IMessage) {
    const { content, receiverId, senderId, sendTimestamp, isRead, isDeleted } = message;
    const savedMessage = await this.queryOne<IMessage>(
      `
        INSERT INTO messages (content, receiverId, senderId, sendTimestamp, isRead, isDeleted)
        values ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `,
      [content, receiverId, +senderId, sendTimestamp ? +(sendTimestamp / 1000).toFixed(0) : null, isRead, false],
    );
    return transform(savedMessage);
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
