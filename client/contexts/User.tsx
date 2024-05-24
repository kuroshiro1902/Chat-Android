import { createContext, useCallback, useEffect, useState } from 'react';
import { IUser } from '../models/user.model';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';
import { IFriendRequest } from '../models/friend-request.model';
import { IMessage } from '../models/message.model';

export interface UserData {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  friends: IUser[];
  setFriends: React.Dispatch<React.SetStateAction<IUser[]>>;
  onlineFriendIds: {
    [friendId: string]: boolean;
  };
  setOnlineFriendIds: React.Dispatch<
    React.SetStateAction<{
      [friendId: string]: boolean;
    }>
  >;
  newestMessages: {
    [friendId: number]: IMessage | undefined;
  };
  setNewestMessage: React.Dispatch<
    React.SetStateAction<{
      [friendId: number]: IMessage | undefined;
    }>
  >;
  refetchFriends: () => void;
  friendAcceptances: IFriendRequest[];
  setFriendAcceptances: React.Dispatch<React.SetStateAction<IFriendRequest[]>>;
  refetchFriendAcceptances: () => void;
}
export const UserContext = createContext<UserData>({} as UserData);
function UserProvider({ children }: any) {
  const [user, setUser] = useState<IUser | null>(null);
  const [friends, setFriends] = useState<IUser[]>([]);
  const [onlineFriendIds, setOnlineFriendIds] = useState<{ [friendId: number]: boolean }>({});
  const [friendAcceptances, setFriendAcceptances] = useState<IFriendRequest[]>([]);
  const [newestMessages, setNewestMessage] = useState<{
    [friendId: number]: IMessage | undefined;
  }>({});

  const refetchFriends = useCallback(() => {
    api
      .get<{ data?: IUser[] }>('/users/friends')
      .then(({ data }) => {
        if (data.data) {
          setFriends(data.data);
        } else {
          setFriends([]);
        }
      })
      .catch(() => {
        setFriends([]);
      });
  }, [user]);

  const refetchFriendAcceptances = useCallback(() => {
    api
      .get<{ data?: IFriendRequest[] }>('/users/all-acceptances')
      .then(({ data }) => {
        if (data.data) {
          console.log(data.data);
          setFriendAcceptances(data.data);
        } else {
          setFriendAcceptances([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setFriendAcceptances([]);
      });
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        onlineFriendIds,
        friends,
        setOnlineFriendIds,
        setFriends,
        newestMessages,
        setNewestMessage,
        refetchFriends,
        friendAcceptances,
        setFriendAcceptances,
        refetchFriendAcceptances,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
