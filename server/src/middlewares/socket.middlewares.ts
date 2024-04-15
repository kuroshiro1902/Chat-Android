import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { IUserDTO } from '../common/models/user.model';
import env from '../env';

export function socketMiddleware(socket: Socket, next: any) {
  const token = socket.handshake.headers.authorization;

  if (!token) {
    socket.data = {
      isSuccess: false,
      message: 'Token not provided.',
    };
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token!.substring(7), env.SECRET_KEY!) as IUserDTO;
    socket.data = { isSuccess: true, message: 'Success', user: decoded };
    next();
    return;
  } catch (error) {
    console.error(error);
    socket.data = {
      isSuccess: false,
      message: 'Invalid token.',
    };
    next();
    return;
  }
}
