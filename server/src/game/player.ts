import { Namespace, Socket } from 'socket.io';
import { ROOMS } from './rooms';
import { Chess, Move } from 'chess.js';
import { IChatMessage } from './models/ChatMessage.model';

export function Player(socket: Socket, namespace: Namespace) {
  const playerId = (socket.handshake.query?.playerId as string) ?? socket.id;
  let inRoomId: string | undefined = undefined;
  let chess: Chess | undefined = undefined;

  const _onJoinRoom = (roomId?: string) => {
    console.log('join room', roomId);
    
    const room = ROOMS.addToRoom(playerId, roomId);
    if (room) {
      socket.join(room.id);
      inRoomId = room.id;
      chess = room.chess;
      const sendPacket = {id: room.id, isStarted: room.isStarted, playerIds: room.playerIds};
      socket.emit('joined-room', sendPacket);
      socket.to(room.id).emit('joined-room', sendPacket);
    } else {
      socket.emit('room-full');
    }
  };

  const _onLeaveRoom = () => {
    ROOMS.deleteFromRoom(playerId, inRoomId!);
    socket.to(inRoomId!).emit('leave-room', playerId);
  };

  const _onChat = (message: IChatMessage) => {
    socket.to(inRoomId!).emit('chat', JSON.stringify(message));
  };

  const _onDisconnect = () => {
    console.log(playerId + ' disconnected.');
    if (inRoomId) {
      _onLeaveRoom();
    }
  };

  const _onMove = (move: Move) => {
    socket.to(inRoomId!).emit('move', JSON.stringify(move));
  };

  const events: { [key: string]: (...args: any) => void } = {
    'join-room': _onJoinRoom,
    'leave-room': _onLeaveRoom,
    disconnect: _onDisconnect,
    move: _onMove,
    chat: _onChat,
  };

  Object.keys(events).forEach((e) => {
    socket.on(e, events[e]);
  });
}
