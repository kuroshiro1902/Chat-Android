import jwt from 'jsonwebtoken';
import { IUserDTO } from '../common/models/user.model';
import { EStatusCode } from '../common/constants/status-code.constant';
import env from '../env';
import { ApiRequest, ApiResponse } from '../common/models/api.model';
import { Socket } from 'socket.io';
import { NextFunction } from 'express';

export interface AuthMiddlewareRequest extends ApiRequest {
  user?: IUserDTO;
}
export function authMiddleware(
  req: AuthMiddlewareRequest,
  res: ApiResponse,
  next: any
) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res
      .status(EStatusCode.INVALID_INPUT)
      .json({ message: 'Không có token.' });
  }
  try {
    const decoded = jwt.verify(token, env.SECRET_KEY!) as IUserDTO;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(EStatusCode.UNAUTHORIZED).json({
      message: 'Token không hợp lệ hoặc đã hết hạn, vui lòng đăng nhập lại.',
    });
  }
}

export function authSocketMiddleware(socket: Socket, next: any){
  const token = socket.handshake.auth.token;
  const error = () => {
    const err = new Error("Not authorized");
    err.message = "Token không hợp lệ hoặc đã hết hạn, vui lòng đăng nhập lại.";
    next(err);
    socket.disconnect(true);
  }
  if(!token) {
    socket.emit('no-token');
    error();
  }
  try {
    const decoded = jwt.verify(token, env.SECRET_KEY!) as IUserDTO;  
    next();
  } catch (e) {
    socket.emit('token-expired');
    error();
  }
}
