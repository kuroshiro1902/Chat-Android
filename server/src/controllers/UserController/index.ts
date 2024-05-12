import { IUser, UserDTO } from '../../common/models/user.model';
import { ApiRequest, ApiResponse } from '../../common/models/api.model';
import { paramsSerialize } from '../../common/utils/paramsSerialize.util';
import { EStatusCode } from '../../common/constants/status-code.constant';
import { serverError } from '../../errors';
import userService from '../../services/user.service';
import apiService from '../../services/api.service';

class UserController {
  async getFriendsOfUser(req: ApiRequest, res: ApiResponse) {
    try {
      // @ts-ignore
      const { id } = req.user;
      const friends = await userService.getFriendsById(id);
      return res.status(EStatusCode.SUCCESS).json({ isSuccess: true, data: friends ?? [] });
    } catch (error) {
      console.error(error);
      serverError(res);
    }
  }
  async searchFriends(req: ApiRequest, res: ApiResponse) {
    try {
      // @ts-ignore
      const { id } = req.user;
      const searchValue = req.query.search ?? '';
      if (typeof searchValue === 'object') {
        return res
          .status(EStatusCode.INVALID_INPUT)
          .json({ isSuccess: false, message: 'Search phải là 1 chuỗi kí tự.' });
      }
      const users = await userService.searchUsers(searchValue, { exceptId: id });
      return res.status(EStatusCode.SUCCESS).json({ isSuccess: true, data: users.map((user) => UserDTO(user)) });
    } catch (error) {
      console.error(error);
      serverError(res);
    }
  }
}

export default new UserController();
