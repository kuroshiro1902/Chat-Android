import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { UserContext } from './User';
import { chatServer, server } from '../environments';
import { IUser } from '../models/user.model';
import { getToken } from '../api';
import { IMessage } from '../models/message.model';

export const SocketHandler = {
  receiveMessage: (message: IMessage): void => {},
  deleteMessage: (messageId: number): void => {},
  newestMessage: (message: IMessage): void => {},
  hasReadMessages: (senderId: number): void => {},
};

export interface SocketData {
  client: Socket | null;
}
export const SocketContext = createContext<SocketData>({} as SocketData);
function SocketProvider({ children, navigation }: any) {
  const { user, setUser, setOnlineFriendIds, setIsNotReadMessageOfFriendIds, refetchFriends } = useContext(UserContext);
  const [client, setClient] = useState<Socket | null>(null);

  const initEventListeners = useCallback((client: Socket) => {
    console.log('init socket client event listeners');

    client.on('connect_error', (err) => {
      console.log('Connect error!');
      console.log(err);
    });
    client.on('unauthorized', () => {
      console.log('Token không hợp lệ.'); // TEST
    });
    SocketHandler.receiveMessage = (message) => {
      setIsNotReadMessageOfFriendIds((prev) => ({ ...prev, [message.senderId]: true }));
    };
    const chatEvents: { [key: string]: (...args: any[]) => void } = {
      'get-online-friends': (data: IUser[]) => {
        console.log('online friends:', data);

        setOnlineFriendIds(data.reduce((prev, user) => ({ ...prev, [user.id]: true }), {}));
      },
      'friend-online': (data: IUser) => {
        setOnlineFriendIds((prev) => ({ ...prev, [data.id]: true }));
      },
      'friend-offline': (data: IUser) => {
        setOnlineFriendIds((prev) => ({ ...prev, [data.id]: false }));
      },
      'delete-message': (messageId: number) => {
        SocketHandler.deleteMessage?.(messageId);
      },
      'newest-message': (data: IMessage) => {
        console.log('newest message: ', data);

        SocketHandler.newestMessage(data);
      },
      'refetch-friends': () => {
        refetchFriends();
      },
      message: (data: IMessage) => {
        console.log(data);

        SocketHandler.receiveMessage?.(data);
      },
    };

    Object.keys(chatEvents).forEach((key) => {
      client.on(key, chatEvents[key]);
    });
  }, []);

  useEffect(() => {
    const initSocketClient = async () => {
      if (!user) {
        client?.disconnect();
        setClient(null);
        setOnlineFriendIds({});
        return;
      }
      const token = await getToken();
      if (user && token && !client) {
        let _client: Socket;
        setClient(() => {
          _client = io(chatServer.url, {
            autoConnect: false,
            extraHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          _client.connect();
          initEventListeners(_client);
          return _client;
        });
      }
    };
    initSocketClient();
  }, [user]);
  return <SocketContext.Provider value={{ client }}>{children}</SocketContext.Provider>;
}

export default SocketProvider;
