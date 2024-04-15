import axios from 'axios';
import apiService from './api.service';
import { IUser, IUserDTO, UserDTO } from '../common/models/user.model';

export const userDbPath = '/users';
class UserService {
  async findOneByUsername(username: string) {
    const res = await apiService.get<IUser[]>(userDbPath, { username });
    if (res.data.length < 1) return null;
    return res.data[0];
  }
  async findById(id: number | string) {
    try {
      const res = await apiService.get<IUser>(userDbPath + '/' + id);
      if (!!!res.data) return null;
      return res.data;
    } catch (error) {
      return null;
    }
  }
  async findByIds(ids: number[] | string[]) {
    try {
      const userPromises = ids.map((id) => apiService.get<IUser>(userDbPath + '/' + id));
      const users = (await Promise.allSettled(userPromises))
        .filter((r) => r.status === 'fulfilled')
        .map((r: any) => {
          try {
            const _user = r?.value?.data;
            if (_user) {
              return UserDTO(_user);
            } else return null;
          } catch (error) {
            return null;
          }
        })
        .filter((u) => !!u);
      return users;
    } catch (error) {
      return [];
    }
  }
  async getFriendsById(userId: number) {
    try {
      const user = await this.findById(userId);
      if (!user) throw new Error('User not found!');
      const friends = await this.findByIds(user.friendIds);
      return friends;
    } catch (error) {
      return null;
    }
  }
}

export default new UserService();
