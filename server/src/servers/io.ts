import { Namespace, Server, Socket } from 'socket.io';
import server from '.';
import { socketMiddleware } from '../middlewares/socket.middlewares';
import { IUserDTO } from '../common/models/user.model';
import socketController, { ESocketEvents } from '../controllers/SocketController';
const io = new Server(server, {
  cors: {
    origin: '*', // Thay đổi thành địa chỉ của ứng dụng React của bạn
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Cho phép sử dụng cookie hoặc header xác thực
    optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  },
});

const _namespace = io.of('/chat');

export default {
  namespace: _namespace,
  run: function () {
    this.namespace.use(socketMiddleware);
    socketController.setNamespace(this.namespace);
    this.namespace.on('connection', (socket: Socket) => {
      const { data } = socket;
      if (data.isSuccess && data.user) {
        socketController.add(socket);
      } else {
        socket.emit(ESocketEvents.UNAUTHORIZED, data);
      }
    });
  },
};
