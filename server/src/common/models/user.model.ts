export interface IUser {
  id?: number;
  name: string;
  username: string;
  password: string;
  elo: number;
}

export interface IUserDTO {
  id?: number;
  name: string;
  username: string;
  elo: number;
}

export const UserDTO = (user: IUser): IUserDTO => {
  const _user = { ...user, password: null };
  return _user;
};
