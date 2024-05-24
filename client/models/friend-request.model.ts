export interface IFriendRequest {
  id: number;
  senderId: number;
  senderName?: string;
  receiverId: number;
  content: string;
  sendTimestamp: number;
  type: 'request' | 'acceptance';
}
