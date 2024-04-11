export interface IRoomInput {
  receiverId: number; // Có thể là id của group hoặc id của user
  name: string;
  avatarUrl?: string;
}