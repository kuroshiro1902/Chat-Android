export interface IUser {
  id?: number;
  name: string;
  username: string;
  password: string;
  friendIds: number[];
}

export interface IUserDTO {
  id?: number;
  name: string;
  // friendIds: number[];
}

export const UserDTO = (user: IUser): IUserDTO => {
  const { id, name } = user;
  return { id, name };
};
