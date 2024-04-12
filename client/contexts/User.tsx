import { createContext, useEffect, useState } from "react";
import { IUser } from "../models/user.model";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserData {
  user: IUser | null,
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>,
  onlineFriendIds: {
    [friendId: string]: boolean;
  },
  setOnlineFriendIds: React.Dispatch<React.SetStateAction<{
    [friendId: string]: boolean;
  }>>
}
export const UserContext = createContext<UserData>({} as UserData)
function UserProvider({children}: any) {
  const [user, setUser] = useState<IUser | null>(null);
  const [onlineFriendIds, setOnlineFriendIds] = useState<{[friendId: string]: boolean}>({});
  
  return (
    <UserContext.Provider value={{user, setUser, onlineFriendIds, setOnlineFriendIds}}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
