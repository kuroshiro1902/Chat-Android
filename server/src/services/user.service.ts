import axios from 'axios';
import apiService from './api.service';
import { IUser, IUserDTO, UserDTO } from '../common/models/user.model';
import Service from './service';

export const userDbPath = '/users';
class UserService extends Service {
  async findOneByUsername(username: string) {
    // const res = await apiService.get<IUser[]>(userDbPath, { username });
    const user = await this.queryOne<IUser>(
      `
      SELECT * FROM users WHERE username = $1
    `,
      [username],
    );
    return user;
  }
  async findById(id: number | string) {
    const user = await this.queryOne<IUser>(
      `
      SELECT * FROM users WHERE id = $1
    `,
      [+id],
    );
    return user;
  }
  async createUser(user: IUser) {
    const { username, password, name } = user;
    const savedUser = await this.queryOne<IUser>(
      `
    INSERT INTO users (username, password, name)
    VALUES ($1, $2, $3) RETURNING *;
    `,
      [username, password, name],
    );
    return savedUser;
  }
  async findByIds(ids: number[] | string[]) {
    const query = `
      SELECT *
      FROM users
      WHERE id IN (${ids.map((_, index) => `$${index + 1}`).join(', ')});
    `;
    const users = await this.query<IUser>(query, ids);
    return users;
  }

  async getFriendsById(userId: number) {
    const friends = await this.query<IUser>(
      `
        SELECT u.*
        FROM users u
        LEFT JOIN friend_rel fr ON u.id = fr.uid1 OR u.id = fr.uid2
        WHERE (fr.uid1 = $1 OR fr.uid2 = $1) AND u.id != $1;
      `,
      [+userId],
    );

    return friends;
  }

  async searchUsers(searchValue: string, options?: { exceptId?: number }) {
    const users = await this.query<IUser>(
      `
        SELECT * 
        FROM users 
        WHERE LOWER(name)
        LIKE LOWER('%${searchValue}%')
        AND id != $1
        ;
      `,
      [options?.exceptId ?? -1],
    );

    return users;
  }
}

export default new UserService();
