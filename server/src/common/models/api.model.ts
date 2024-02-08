import { Request, Response } from 'express';
import { IUser } from './user.model';

export interface IApiResponse {
  isSuccess?: boolean;
  message?: string;
  data?: any;
}

export type ApiRequest = Request;

export type ProtectedApiRequest = Request & {user: IUser} 

export type ApiResponse = Response<IApiResponse>;
