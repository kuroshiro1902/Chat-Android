import axios from 'axios';
import env from '../../env';
import { IUser, UserDTO } from '../../common/models/user.model';
import { ApiRequest, ApiResponse } from '../../common/models/api.model';
import { paramsSerialize } from '../../common/utils/paramsSerialize.util';
import { EStatusCode } from '../../common/constants/status-code.constant';
import { serverError } from '../../errors';

export const userPath = '/users';
export const userDbPath = env.DB_URL + userPath;
const eloPerMatch: {[key: string]: number} = {
  win: 20,
  loss: -20,
  draw: 0
}
class UserController {
  async findOneById(req: ApiRequest, res: ApiResponse) {
    try {
      const playerId = req.query.id as string;

      if (!!!playerId) {
        return res
          .status(EStatusCode.INVALID_INPUT)
          .json({ message: 'Invalid Id!' });
      }

      const user = await this.findOneByIdFn(playerId);

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

  async updateElo(req: ApiRequest, res: ApiResponse) {
    try {
      console.log('updateElo');
      
      const playerId = req.params.id as string;
      const matchStatus = req.body.matchStatus as string;

      const additionElo = eloPerMatch[matchStatus];

      if (!!!playerId) {
        return res
          .status(EStatusCode.INVALID_INPUT)
          .json({ message: 'Invalid Id!' });
      }

      const user = await this.findOneByIdFn(playerId);

      if (!user) {
        return res
          .status(EStatusCode.NOT_FOUND)
          .json({ message: 'Username not found.' });
      }

      const {data: updatedUser} = await axios.patch<IUser>(userDbPath+`/${user.id}`, {elo: user.elo + additionElo})
      res.json({ isSuccess: true, data: {...UserDTO(updatedUser), username: null} });
    } catch (error) {
      console.error(error);
      serverError(res);
    }
  }

  async findOneByIdFn(id: string) {
    const res = await axios.get<IUser[]>(
      userDbPath + paramsSerialize({ id })
    );
    if (res.data.length < 1) return null;
    return res.data[0];
  }

}

export default new UserController();
