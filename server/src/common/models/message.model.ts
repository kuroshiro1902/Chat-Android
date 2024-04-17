export interface IMessage {
  id?: number;
  content: string;
  receiverId: number;
  senderId: number;
  sendTimestamp: number;
  isDeleted: boolean;
}

export interface IMessageInput {
  content: string;
  receiverId: number;
  senderId: number;
}
