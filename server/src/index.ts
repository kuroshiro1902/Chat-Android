import 'dotenv/config';
import { Server } from 'http';
import express from 'express';
import router from './routes';
import database from './database';
import { Game } from './game';
import env from './env';
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);
app.use(database);

const httpServer = new Server(app);

database.listen(env.DB_PORT, () => {
  console.log('Database listening on port ' + env.DB_PORT);
});

httpServer.listen(env.PORT, () => {
  console.log('Server listening on port ' + env.PORT);
});

Game(httpServer).start();