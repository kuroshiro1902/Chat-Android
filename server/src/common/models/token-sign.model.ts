import { IUser, IUserDTO } from './user.model';

export const tokenSign = (user: IUser | IUserDTO) => {
  const { id, name } = user;
  return { id, name };
};
