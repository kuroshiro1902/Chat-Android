import { Namespace, Socket } from 'socket.io';
import { ROOMS } from './rooms';
import { Chess, Move } from 'chess.js';
import { IChatMessage } from './models/ChatMessage.model';
import { Room } from './models/Room.model';
import userController from '../controllers/User/user.controller';

export function Player(socket: Socket, namespace: Namespace) {
  const playerId = (socket.handshake.query?.playerId as string) ?? socket.id;
  let inRoomId: string | undefined = undefined;
  let chess: Chess | undefined = undefined;
  let room : Room | undefined = undefined; 

  const _onJoinRoom = async (roomId?: string) => {    
    room = ROOMS.addToRoom(playerId, roomId);
    if (room) {
      socket.join(room.id);
      inRoomId = room.id;
      chess = room.chess;
      const self = await userController.findOneByIdFn(playerId);
      const _opponentId = room.getOpponentId(playerId);
      const opponent = _opponentId ? await userController.findOneByIdFn(_opponentId) : null;
      const joinedRoomPacket = {id: room.id, isStarted: room.isStarted, opponent: opponent};
      const opponentJoinedRoomPacket = {...joinedRoomPacket, opponent: self};
      socket.emit('joined-room', joinedRoomPacket);
      //
      const readyPlayers = room!.readyPlayers;
      const selfReady = readyPlayers[playerId];
      const opponentReady = _opponentId ? readyPlayers[_opponentId] : false;
      socket.emit('ready',{self: selfReady,opponent: opponentReady})
      socket.to(inRoomId!).emit('ready', {self: opponentReady, opponent: selfReady});
      //
      socket.to(room.id).emit('opponent-joined-room', opponentJoinedRoomPacket);
    } else {
      socket.emit('room-full');
    }
  };

  const _onLeaveRoom = () => {
    // Kiểm tra xem game đấu tại phòng có đang diễn ra không, nếu có thì trừ elo của người rời và cộng elo cho người chơi còn lại
    //
    ROOMS.deleteFromRoom(playerId, inRoomId!);
    socket.to(inRoomId!).emit('opponent-left-room', playerId);
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

  const _onReady = () => {
    const readyPlayers = room!.playerReady(''+playerId);
    const self = readyPlayers[playerId];
    const _opponentId = room!.getOpponentId(''+playerId);
    const opponent = _opponentId ? readyPlayers[_opponentId] : false;
    socket.emit('ready',{self,opponent})
    socket.to(inRoomId!).emit('ready', {self: opponent, opponent: self});
  }

  const _onMove = (move: Move) => {
    socket.to(inRoomId!).emit('move', JSON.stringify(move));
  };

  const events: { [key: string]: (...args: any) => void } = {
    'join-room': _onJoinRoom,
    'leave-room': _onLeaveRoom,
    'ready': _onReady,
    disconnect: _onDisconnect,
    move: _onMove,
    chat: _onChat,
  };

  Object.keys(events).forEach((e) => {
    socket.on(e, events[e]);
  });
}
