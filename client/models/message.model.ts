export interface IMessage {
  id?: number;
  content: string;
  receiverId: number;
  senderId: number;
  sendTimestamp: number;
}
