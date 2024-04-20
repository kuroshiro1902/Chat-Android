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
  DELETE_MESSAGE = 'delete-message',
  NEWEST_MESSAGE = 'newest-message', // emit when someone send or delete message
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
    console.log(user.name, 'is online!');
    const _socket = this.get(user.id);
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
  async sendMessage(messageInput: IMessageInput) {
    const res = await messageService.sendMessage(messageInput);
    if (res?.data) {
      const message = res.data;
      const senderSocket = this.get(message.senderId);
      if (res.isSuccess) {
        const receiverSocket = this.get(message.receiverId);
        senderSocket?.emit(ESocketEvents.MESSAGE, message);
        receiverSocket?.emit(ESocketEvents.MESSAGE, message);

        senderSocket?.emit(ESocketEvents.NEWEST_MESSAGE, message);
        receiverSocket?.emit(ESocketEvents.NEWEST_MESSAGE, message);
      } else {
        senderSocket?.emit(ESocketEvents.SEND_MESSAGE_FAIL, message);
      }
    }
  }
  async deleteMessage(message: IMessage) {
    if (message?.id) {
      const res = await messageService.deleteMessage(message.id);
      if (res.isSuccess) {
        const { id, senderId, receiverId } = message;
        const receiverSocket = this.get(receiverId);
        const senderSocket = this.get(senderId);
        receiverSocket?.emit(ESocketEvents.DELETE_MESSAGE, id);
        senderSocket?.emit(ESocketEvents.DELETE_MESSAGE, id);

        const newestMessage = (
          await messageService.getMessages(senderId, receiverId, {
            pageIndex: 1,
            perPage: 1,
            sortBy: 'sendTimestamp',
            order: 'desc',
          })
        )?.[0];
        senderSocket?.emit(ESocketEvents.NEWEST_MESSAGE, newestMessage);
        receiverSocket?.emit(ESocketEvents.NEWEST_MESSAGE, newestMessage);
      }
    }
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
    console.log('init events again');

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
    socket.on('delete-message', (message: IMessage) => {
      this.deleteMessage(message);
    });
  }

  private getUserBySocket(socket: Socket) {
    const user: IUserDTO = socket.data.user;
    if (!user.id) return;
    return user;
  }
}

export default new SocketController();
