import { Namespace, Socket } from 'socket.io';
import { IUser, IUserDTO } from '../../common/models/user.model';
import userService from '../../services/user.service';
import { IMessage, IMessageInput } from '../../common/models/message.model';
import messageService from '../../services/message.service';

export enum ESocketEvents {
  ONLINE = 'online',
  FRIEND_ONLINE = 'friend-online',
  FRIEND_OFFLINE = 'friend-offline',
  GET_ONLINE_FRIENDS = 'get-online-friends',
  MESSAGE = 'message',
  SEND_MESSAGE_FAIL = 'send-message-fail',
  UNAUTHORIZED = 'unauthorized',
}
class SocketController {
  private namespace?: Namespace;
  /**
   * @property { user.id : socket.id }
   */
  private socketIds: { [userId: number]: string } = {};

  setNamespace(namespace: Namespace) {
    this.namespace = namespace;
  }
  online(socket: Socket) {
    // called 1 time when the user is online.
    const user: IUserDTO = socket.data.user;
    if (!user?.id) return;
    const _socket = this.get(user.id);
    console.log(user.name + ' online!'); // TEST
    if (_socket) {
      _socket.emit(ESocketEvents.ONLINE);
      userService.getFriendsById(user.id).then((friends) => {
        const onlineFriends: IUserDTO[] = [];
        friends?.forEach((friend) => {
          if (friend?.id) {
            const friendSocket = this.get(friend.id);
            if (friendSocket) {
              friendSocket.emit(ESocketEvents.FRIEND_ONLINE, user);
              onlineFriends.push(friend);
            }
          }
        });
        _socket.emit(ESocketEvents.GET_ONLINE_FRIENDS, onlineFriends);
      });
    }
  }
  offline(socket: Socket) {
    const user = this.getUserBySocket(socket);
    if (!user || !user?.id) return;
    this.delete(user.id!);
    userService.getFriendsById(user.id).then((friends) => {
      friends?.forEach((friend) => {
        if (friend?.id) {
          this.get(friend.id)?.emit(ESocketEvents.FRIEND_OFFLINE, user);
        }
      });
    });
  }
  sendMessage(message: IMessageInput) {
    messageService.sendMessage(message).then((res) => {
      if (res) {
        const senderSocket = this.get(message.senderId);
        if (res.isSuccess) {
          const receiverSocket = this.get(message.receiverId);
          senderSocket?.emit(ESocketEvents.MESSAGE, res);
          receiverSocket?.emit(ESocketEvents.MESSAGE, res);
        } else {
          senderSocket?.emit(ESocketEvents.SEND_MESSAGE_FAIL, res);
        }
      }
    });
  }
  add(socket: Socket) {
    this.socketIds[socket.data.user.id] = socket.id;
    this.initEvents(socket);
    return true;
  }
  get(userId: number): Socket | undefined {
    return this.namespace?.sockets.get(this.socketIds[userId]);
  }
  delete(userId: number) {
    delete this.socketIds[userId];
  }

  private initEvents(socket: Socket) {
    this.online(socket);
    socket.on('disconnect', () => {
      console.log(socket?.data?.user?.name + ' disconnected.');
      this.offline(socket);
    });
    socket.on('message', (message: IMessageInput) => {
      const user = this.getUserBySocket(socket);
      if (!user) {
        return;
      }
      this.sendMessage({ senderId: user.id!, content: message.content, receiverId: message.receiverId });
    });
  }

  private getUserBySocket(socket: Socket) {
    const user: IUserDTO = socket.data.user;
    if (!user.id) return;
    return user;
  }
}

export default new SocketController();
