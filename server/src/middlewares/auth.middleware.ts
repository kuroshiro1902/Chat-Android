import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUserDTO } from '../common/models/user.model';
import { EStatusCode } from '../common/constants/status-code.constant';
import env from '../env';

export function authMiddleware(req: Request, res: Response, next: any) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(EStatusCode.INVALID_INPUT).json({ message: 'Token not provided.' });
  }
  try {
    const decoded = jwt.verify(token.substring(7), env.SECRET_KEY!);

    // @ts-ignore
    req.user = decoded;
    next();
  } catch (error) {
    res.status(EStatusCode.UNAUTHORIZED).json({ message: 'Invalid token.' });
  }
}
