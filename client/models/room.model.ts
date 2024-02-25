export interface IRoom {
  id: string;
  isStarted: boolean;
  hostId: string;
  playerIds: string[];
}