import { Room } from './models/Room.model';

class Rooms {
  private isPlayerInRoom: {[playerId: string]: boolean} = {};
  private _value: { [roomId: string]: Room | undefined } = {};
  constructor() {}

  getRoom(roomId: string) {
    return this._value[roomId];
  }

  addToRoom(playerId: string, roomId?: string) {
    const _roomId = roomId ?? (playerId + '_' + new Date().getTime());
    if (!this.isExisted(_roomId)){
      this._value[_roomId] = new Room(_roomId);
    }
    if (!this.isPlayerInRoom[playerId]){
      this.isPlayerInRoom[playerId] = true;
    }
    const isSuccess = this._value[_roomId]?.addPlayer(playerId);
    return isSuccess ? this._value[_roomId] : undefined;
  }

  /**
   * 
   * @param playerId 
   * @param roomId 
   * @returns Số lượng player còn lại trong phòng.
   * Nếu phòng không tồn tại trả về -1.
   */
  deleteFromRoom(playerId: string, roomId: string): number {
    if (this.isExisted(roomId) && this.isPlayerInRoom[playerId]) {
      delete this.isPlayerInRoom[playerId];
      const playersInRoomCount = this._value[roomId]!.removePlayer(playerId);
      if (playersInRoomCount < 1) delete this._value[roomId];
      return playersInRoomCount;
    }
    return -1;
  }

  private isExisted(roomId: string): boolean {
    return !!this._value[roomId];
  }
}

export const ROOMS = new Rooms();
