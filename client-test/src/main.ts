import { io } from "socket.io-client";

const client = io('http://localhost:3000/game');
client.connect()