import { IUserDTO } from './user.model';

export interface IGroup {
  id: number;
  name: string;
  hostId: number;
  members: IUserDTO[];
  created_at: number;
  modified_at?: number;
}
