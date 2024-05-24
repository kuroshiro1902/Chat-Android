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

  async createFriendRequest(senderId: number, receiverId: number, content?: string) {
    const sendTimestamp = +(new Date().getTime() / 1000).toFixed(0);
    const friendReq = await this.queryOne<{
      id: number;
      senderid: number;
      receiverid: number;
      content: string;
      sendtimestamp: number;
    }>(
      `
      INSERT INTO friend_req (senderId, receiverId, content, sendTimestamp)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `,
      [+senderId, +receiverId, content ?? 'Gửi yêu cầu kết bạn từ trang cá nhân.', sendTimestamp],
    );
    if (!friendReq) return undefined;
    const { id, senderid, receiverid, content: _content, sendtimestamp } = friendReq;
    return {
      id,
      senderId: senderid,
      receiverId: receiverid,
      content: _content,
      sendTimestamp: sendtimestamp,
    };
  }

  async acceptFriendRequest(friendReqId: number, receiverId: number) {
    const friendReq = await this.queryOne<{
      id: number;
      senderid: number;
      receiverid: number;
      content: string;
      sendtimestamp: number;
    }>(
      `
      SELECT * from friend_req 
      WHERE id = $1
      AND receiverid = $2
      LIMIT 1;
    `,
      [+friendReqId, +receiverId],
    );

    if (!friendReq) return undefined;

    await this.query(
      `
      DELETE from friend_req 
      WHERE id = $1
      AND receiverid = $2;
    `,
      [+friendReqId, +receiverId],
    );

    const { senderid, receiverid } = friendReq;

    const friendRel = await this.queryOne(
      `
      INSERT INTO friend_rel (uid1, uid2)
      VALUES ($1, $2)
      RETURNING *;
    `,
      [+senderid, +receiverid],
    );

    const newFriend = await this.findById(senderid);

    return newFriend;
  }

  async getFriendRequest(senderId: number, receiverId: number) {
    const friendReq = await this.queryOne<{
      id: number;
      senderid: number;
      receiverid: number;
      content: string;
      sendtimestamp: number;
    }>(
      `
      SELECT * from friend_req 
      WHERE senderid = $1
      AND receiverid = $2
      LIMIT 1;
    `,
      [+senderId, +receiverId],
    );
    if (!friendReq) return undefined;
    const { id, senderid, receiverid, content, sendtimestamp } = friendReq;
    return {
      id,
      senderId: senderid,
      receiverId: receiverid,
      content,
      sendTimestamp: sendtimestamp,
    };
  }
  async getAllAcceptances(userId: number) {
    const friendReqs = await this.query<{
      id: number;
      senderid: number;
      sendername: string;
      receiverid: number;
      content: string;
      sendtimestamp: number;
    }>(
      `
      SELECT fr.*, u.name as sendername from friend_req fr
      LEFT JOIN users u ON fr.senderId = u.id
      WHERE receiverid = $1;
    `,
      [+userId],
    );

    return friendReqs.map((friendReq) => {
      const { id, senderid, receiverid, content, sendername, sendtimestamp } = friendReq;
      return {
        id,
        senderId: senderid,
        senderName: sendername,
        receiverId: receiverid,
        content,
        sendTimestamp: sendtimestamp,
      };
    });
  }

  async deleteFriend(uid1: number, uid2: number) {
    const _ = await this.queryOne(
      `
      DELETE FROM friend_rel 
      WHERE (uid1 = $1 AND uid2 = $2)
      OR (uid1 = $2 AND uid2 = $1);
    `,
      [uid1, uid2],
    );
    return _;
  }
}

export default new UserService();
