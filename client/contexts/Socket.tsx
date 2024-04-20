import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { UserContext } from './User';
import { chatServer, server } from '../environments';
import { IUser } from '../models/user.model';
import { getToken } from '../api';
import { IMessage } from '../models/message.model';

export const SocketHandler: { [key: string]: (...data: any) => any } = {
  receiveMessage: (message: IMessage) => {},
  deleteMessage: (messageId: number) => {},
  historyChange: () => {},
};

export interface SocketData {
  client: Socket | null;
}
export const SocketContext = createContext<SocketData>({} as SocketData);
function SocketProvider({ children, navigation }: any) {
  const { user, setUser, setOnlineFriendIds } = useContext(UserContext);
  const [client, setClient] = useState<Socket | null>(null);

  const initEventListeners = useCallback((client: Socket) => {
    // client.on('connect', () => {
    //   console.log('Connect to server!'); // TEST
    // });
    // client.on('disconnect', () => {
    //   console.log('Disconnect to server!'); // TEST
    // });
    client.on('connect_error', (err) => {
      console.log('Connect error!');
      console.log(err);
    });
    client.on('unauthorized', () => {
      console.log('Token không hợp lệ.'); // TEST
    });

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
      'history-change': () => {
        SocketHandler.historyChange();
      },
      message: (data: IMessage) => {
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
