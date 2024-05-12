import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../../env';
import { IUser, UserDTO } from '../../common/models/user.model';
import { ApiRequest, ApiResponse } from '../../common/models/api.model';
import { EStatusCode } from '../../common/constants/status-code.constant';
import { serverError } from '../../errors';
import { tokenSign } from '../../common/models/token-sign.model';
import apiService from '../../services/api.service';
import userService from '../../services/user.service';

// const authDbPath = '/users';
const tokenLifeTime = '7d';

class AuthController {
  async login(req: ApiRequest, res: ApiResponse) {
    try {
      const { username, password } = req.body;

      if (!!!username || !!!password) {
        return res.status(EStatusCode.INVALID_INPUT).json({ message: 'Invalid username or password!' });
      }

      const user = await userService.findOneByUsername(username);

      if (!user) {
        return res.status(EStatusCode.NOT_FOUND).json({ message: 'Username not found.' });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(EStatusCode.UNAUTHORIZED).json({ message: 'Wrong password!' });
      }
      const token = jwt.sign(tokenSign(user), env.SECRET_KEY!, {
        expiresIn: tokenLifeTime,
      });
      return res.json({ isSuccess: true, data: { token, user: { ...UserDTO(user) } } });
    } catch (error) {
      console.error(error);
      serverError(res);
    }
  }
  async signup(req: ApiRequest, res: ApiResponse) {
    try {
      const { username, password, name } = req.body;

      if (!!!username || !!!password || !!!name) {
        return res.status(400).json({ isSuccess: false, message: 'Missing field!' });
      }

      const existedUser = await userService.findOneByUsername(username);
      if (existedUser) {
        return res.status(EStatusCode.CONFLICT).json({ isSuccess: false, message: 'User already exists!' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user: IUser = {
        username,
        password: hashedPassword,
        name,
        // friendIds: [],
      };
      const savedUser = await userService.createUser(user);
      if (!savedUser) {
        throw new Error('Create user error');
      }
      return res.status(EStatusCode.CREATED).json({ data: UserDTO(savedUser) });
    } catch (error) {
      console.error(error);
      serverError(res);
    }
  }

  async verifyToken(req: ApiRequest, res: ApiResponse) {
    // @ts-ignore
    const { id } = req.user;
    const user = await userService.findById(id);
    if (user) {
      const token: string = jwt.sign(tokenSign(user), env.SECRET_KEY!, {
        expiresIn: tokenLifeTime,
      });
      return res.status(EStatusCode.SUCCESS).json({ isSuccess: true, data: { token, user: UserDTO(user) } });
    } else {
      return res.status(EStatusCode.UNAUTHORIZED).json({ isSuccess: false, message: 'Invalid token!' });
    }
  }
}

export default new AuthController();
