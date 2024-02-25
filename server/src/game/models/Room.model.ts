import { Chess } from 'chess.js';

export class Room {
  id: string;
  playerIds: string[] = [];
  isStarted = false;
  readyPlayers: {[playerId: string]: boolean} = {};
  chess: Chess = new Chess();

  constructor(id: string) {
    this.id = id;
  }

  getOpponentId(selfId: string): string | null {
    return (this.playerIds.filter((id)=>id!==selfId)[0]) ?? null;
  }

  addPlayer(playerId: string) {
    if (this.playerIds.length < 2) {
      this.playerIds.push(playerId);
      this.playerUnready(playerId)
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
    this.playerUnready(playerId);
    this.playerIds = this.playerIds.filter((pid) => pid !== playerId);
    this.isStarted = false;
    return this.playerIds.length;
  }

  playerReady(playerId: string) {
    if(this.playerIds.includes(playerId)){
      this.readyPlayers[playerId] = true;
    }
    return this.readyPlayers;
  }

  playerUnready(playerId: string) {
    if(this.playerIds.includes(playerId)){
      this.readyPlayers[playerId] = false;
    }
    return this.readyPlayers;
  }
}
