export interface IMessage {
  id?: number;
  content: string;
  receiverId: number;
  senderId: number;
  sendTimestamp: number;
  isRead: boolean;
  isDeleted: boolean;
  modifyTimestamp?: number;
}

export interface IMessageInput {
  content: string;
  receiverId: number;
  senderId: number;
}
