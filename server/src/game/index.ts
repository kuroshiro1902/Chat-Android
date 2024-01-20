import { Server as IOServer, Namespace } from 'socket.io';
import { Server } from 'http';
import { Player } from './models/Player.model';

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
      gameNsp.on('connection', (socket) => {
        const player = new Player(socket, gameNsp );
        player.init();
        //
      });
    }
  };
}
