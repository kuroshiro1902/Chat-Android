export interface IMessage {
  id?: number;
  content: string;
  receiverId: number;
  senderId: number;
  sendTimestamp: number;
}

export interface IMessageInput {
  content: string;
  receiverId: number;
  senderId: number;
}
