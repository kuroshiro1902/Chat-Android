export interface IMessage {
  id: number;
  content: string;
  receiverId: string;
  senderId: string;
  sendTimestamp: number;
}
