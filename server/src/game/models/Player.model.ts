import { Namespace, Socket } from "socket.io";
import { ROOMS } from "../subjects";
import { Move } from "chess.js";

export class Player {
  private socket: Socket;
  private playerId: string;
  private nsp: Namespace;
  private inRoomId?: string;

  private events: {[event: string]: (...args: any[]) => void};

  constructor(socket: Socket, namespace: Namespace){
    this.socket = socket;
    this.playerId = socket.handshake.query?.id as string ?? socket.id;
    this.nsp = namespace;
    this.events = {
      'join-room': this._onJoinRoom,
      'disconnect': this._onDisconnect,
      'move': this._onMove
    }
  }

  init(){
    Object.keys(this.events).forEach((e) => {
      this.socket.on(e, this.events[e].bind(this));
    })
    this.socket.emit('connected', this.playerId);
  }

  private _onJoinRoom(roomId: string){
    if (!!!roomId || roomId.length < 1) return;
    const _roomId = roomId ?? this.playerId;
    if(ROOMS.addToRoom(this.playerId, _roomId)){
      this.socket.join(_roomId);
      this.inRoomId = _roomId;
      this.nsp.to(_roomId).emit('joined-room', JSON.stringify(ROOMS.getRoom(_roomId)));
    }
    else {
      this.socket.emit('room-full');
    }
  }

  private _onMove(move: Move){
    // this.socket.on
    this.nsp.emit('move', JSON.stringify(move));
  }

  private _onDisconnect(){
    console.log(this.playerId + ' disconnected.');
    if(this.inRoomId) ROOMS.deleteFromRoom(this.playerId, this.inRoomId!);
  }
} 