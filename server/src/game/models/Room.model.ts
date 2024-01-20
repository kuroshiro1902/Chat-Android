export class Room {
  id: string;
  playerIds: string[] = [];
  isStarted = false;
  constructor (id: string) {
    this.id = id;
  }

  addPlayer(playerId: string) {
    if (this.playerIds.length < 2) {
      this.playerIds.push(playerId);
      return true;
    }
    else {
      return false;
    }
  }
  
  removePlayer(playerId: string) {
    this.playerIds = this.playerIds.filter((pid) => pid !== playerId);
    return true;
  }
}