import 'dotenv/config';
import { Server } from 'http';
import express from 'express';
import router from './routes';
import database from './database';
import { Game } from './game';
import env from './env';

const app = express();
const httpServer = new Server(app);
const { gameNsp } = Game(httpServer);

gameNsp.on('connection', (socket) => {
  console.log(socket.id + ' connected');
});

app.use(express.json());
app.use(router);
app.use(database);

database.listen(env.DB_PORT, () => {
  console.log('Database listening on port ' + env.DB_PORT);
});

httpServer.listen(env.PORT, () => {
  console.log('Server listening on port ' + env.PORT);
});
