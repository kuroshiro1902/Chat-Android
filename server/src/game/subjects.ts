import { Room } from "./models/Room.model";

class Rooms {
  private _value: {[roomId: string]: Room | undefined} = {};
  constructor(){}

  getRoom(roomId: string) {
    return this._value[roomId];
  }

  addToRoom(playerId: string, roomId: string): boolean{
    if (!this.isExisted(roomId)) {
      this._value[roomId] = new Room(roomId);
    }
    return this._value[roomId]!.addPlayer(playerId);
  };

  deleteFromRoom(playerId: string, roomId: string): boolean {
    if(this.isExisted(roomId)) {
      return this._value[roomId]!.removePlayer(playerId);
    };
    return false;
  }

  private isExisted(roomId: string): boolean {
    return !!this._value[roomId];
  }
}

export const ROOMS = new Rooms;

 