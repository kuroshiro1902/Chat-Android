import { Server as IOServer } from 'socket.io';
import { Server } from 'http';
import { Chess } from 'chess.js';

const chess = new Chess();

export function Game(server: Server) {
  
  const io = new IOServer(server, {
    cors: {
      // origin: [...clientENV.url],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });
  
  const gameNsp = io.of('/game');
  gameNsp.on('connection', (socket) => {
    console.log(socket.id + " connected");
    
    socket.on('check', () => {});
  });
  console.log('game socket run');
  return { gameNsp };
}
