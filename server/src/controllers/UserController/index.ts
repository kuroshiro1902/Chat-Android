import { IUser, UserDTO } from '../../common/models/user.model';
import { ApiRequest, ApiResponse } from '../../common/models/api.model';
import { paramsSerialize } from '../../common/utils/paramsSerialize.util';
import { EStatusCode } from '../../common/constants/status-code.constant';
import { serverError } from '../../errors';
import userService from '../../services/user.service';
import apiService from '../../services/api.service';

class UserController {
  async getUserById(req: ApiRequest, res: ApiResponse) {
    try {
      // @ts-ignore
      const { id } = req.user;
      const userId = req.params.userId;
      if (!userId) {
        return res.status(EStatusCode.INVALID_INPUT).json({ isSuccess: false, message: 'User id phải là 1 số.' });
      }
      const user = await userService.findById(userId);
      if (!user) {
        return res.status(EStatusCode.NOT_FOUND).json({ isSuccess: false, message: 'Không tìm thấy user.' });
      }
      return res.status(EStatusCode.SUCCESS).json({ isSuccess: true, data: UserDTO(user) });
    } catch (error) {
      console.error(error);
      serverError(res);
    }
  }
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

  async addFriend(req: ApiRequest, res: ApiResponse) {
    try {
      // @ts-ignore
      const { id: senderId } = req.user;
      const receiverId = +(req.params.receiverId as string);
      if (!receiverId) {
        return res
          .status(EStatusCode.INVALID_INPUT)
          .json({ isSuccess: false, message: 'Không có id người được kết bạn.' });
      }
      const friendRequest = await userService.createFriendRequest(senderId, receiverId);
      if (!friendRequest) {
        return res
          .status(EStatusCode.SERVER_ERROR)
          .json({ isSuccess: false, message: 'Gửi lời mời thất bại, vui lòng thử lại sau.' });
      }
      return res.status(EStatusCode.CREATED).json({ isSuccess: true, data: { ...friendRequest, type: 'request' } });
    } catch (error) {
      console.error(error);
      serverError(res);
    }
  }

  async getFriendRequest(req: ApiRequest, res: ApiResponse) {
    try {
      // @ts-ignore
      const { id: senderId } = req.user;
      const receiverId = +(req.params.receiverId as string);
      if (!receiverId) {
        return res
          .status(EStatusCode.INVALID_INPUT)
          .json({ isSuccess: false, message: 'Không có id người được kết bạn.' });
      }
      const friendRequest = await userService.getFriendRequest(senderId, receiverId);
      if (friendRequest) {
        return res.status(EStatusCode.SUCCESS).json({ isSuccess: true, data: { ...friendRequest, type: 'request' } });
      }
      const friendAcceptance = await userService.getFriendRequest(receiverId, senderId);
      if (friendAcceptance) {
        return res
          .status(EStatusCode.SUCCESS)
          .json({ isSuccess: true, data: { ...friendAcceptance, type: 'acceptance' } });
      }
      return res.status(EStatusCode.SUCCESS).json({ isSuccess: true, data: undefined });
    } catch (error) {
      console.error(error);
      serverError(res);
    }
  }

  async getAllAcceptances(req: ApiRequest, res: ApiResponse) {
    try {
      // @ts-ignore
      const { id: userId } = req.user;
      const friendAcceptances = await userService.getAllAcceptances(userId);
      return res
        .status(EStatusCode.SUCCESS)
        .json({ isSuccess: true, data: friendAcceptances.map((fa) => ({ ...fa, type: 'acceptance' })) });
    } catch (error) {
      console.error(error);
      serverError(res);
    }
  }

  async acceptFriendRequest(req: ApiRequest, res: ApiResponse) {
    try {
      // @ts-ignore
      const { id: receiverId } = req.user;
      const friendReqId = +(req.params.friendReqId as string);

      const newFriend = await userService.acceptFriendRequest(friendReqId, receiverId);
      if (!newFriend) {
        return res
          .status(EStatusCode.SERVER_ERROR)
          .json({ isSuccess: false, message: 'Không thể chấp nhận lời mời kết bạn.' });
      }
      return res.status(EStatusCode.SUCCESS).json({ isSuccess: true, data: UserDTO(newFriend) });
    } catch (error) {
      console.error(error);
      serverError(res);
    }
  }

  async deleteFriend(req: ApiRequest, res: ApiResponse) {
    try {
      // @ts-ignore
      const { id: userId } = req.user;
      const friendId = +(req.params.friendId as string);

      const _ = await userService.deleteFriend(userId, friendId);
      return res.status(EStatusCode.SUCCESS).json({ isSuccess: true, data: friendId });
    } catch (error) {
      console.error(error);
      serverError(res);
    }
  }
}

export default new UserController();
