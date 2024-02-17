import axios from 'axios';
import env from '../../env';
import { IUser, UserDTO } from '../../common/models/user.model';
import { ApiRequest, ApiResponse } from '../../common/models/api.model';
import { paramsSerialize } from '../../common/utils/paramsSerialize.util';
import { EStatusCode } from '../../common/constants/status-code.constant';
import { serverError } from '../../errors';

export const userPath = '/users';
export const userDbPath = env.DB_URL + userPath;

class UserController {
  async findOneById(req: ApiRequest, res: ApiResponse) {
    try {
      const playerId = req.query.id as string;

      if (!!!playerId) {
        return res
          .status(EStatusCode.INVALID_INPUT)
          .json({ message: 'Invalid Id!' });
      }

      const user = await this._findOneById(playerId);

      if (!user) {
        return res
          .status(EStatusCode.NOT_FOUND)
          .json({ message: 'Username not found.' });
      }
      res.json({ isSuccess: true, data: {...UserDTO(user), username: null} });
    } catch (error) {
      console.error(error);
      serverError(res);
    }
  }

  private async _findOneById(id: string) {
    const res = await axios.get<IUser[]>(
      userDbPath + paramsSerialize({ id })
    );
    if (res.data.length < 1) return null;
    return res.data[0];
  }

}

export default new UserController();
