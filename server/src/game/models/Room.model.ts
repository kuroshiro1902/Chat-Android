import { Chess } from 'chess.js';

export class Room {
  id: string;
  playerIds: string[] = [];
  isStarted = false;
  chess: Chess = new Chess();

  constructor(id: string) {
    this.id = id;
  }

  addPlayer(playerId: string) {
    if (this.playerIds.length < 2) {
      this.playerIds.push(playerId);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Trả về số player còn lại trong phòng
   * @param playerId
   * @returns
   */
  removePlayer(playerId: string) {
    this.playerIds = this.playerIds.filter((pid) => pid !== playerId);
    return this.playerIds.length;
  }
}
