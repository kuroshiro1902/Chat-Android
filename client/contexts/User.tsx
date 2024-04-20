import { createContext, useEffect, useState } from 'react';
import { IUser } from '../models/user.model';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  isNotReadMessageOfFriendIds: {
    [friendId: string]: boolean | undefined;
  };
  setIsNotReadMessageOfFriendIds: React.Dispatch<
    React.SetStateAction<{
      [friendId: string]: boolean | undefined;
    }>
  >;
}
export const UserContext = createContext<UserData>({} as UserData);
function UserProvider({ children }: any) {
  const [user, setUser] = useState<IUser | null>(null);
  const [friends, setFriends] = useState<IUser[]>([]);
  const [onlineFriendIds, setOnlineFriendIds] = useState<{ [friendId: string]: boolean }>({});
  const [isNotReadMessageOfFriendIds, setIsNotReadMessageOfFriendIds] = useState<{
    [friendId: string]: boolean | undefined;
  }>({});

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        onlineFriendIds,
        friends,
        setOnlineFriendIds,
        setFriends,
        isNotReadMessageOfFriendIds,
        setIsNotReadMessageOfFriendIds,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
