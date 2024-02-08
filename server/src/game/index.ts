import { Server as IOServer } from 'socket.io';
import { Server } from 'http';
import { Player } from './player';
import { authSocketMiddleware } from '../middlewares/auth.middleware';

export function Game(server: Server) {
  const io = new IOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });
  return { 
    server: io,
    start: ()=>{
      const gameNsp = io.of('game');
      gameNsp.use(authSocketMiddleware);
      gameNsp.on('connection', (socket) => {
        Player(socket, gameNsp );
        //
      });
    }
  };
}
