import { createContext, useState } from "react";
import { IUser } from "../models/user.model";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserData {
  user: IUser | null,
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>
}
export const UserContext = createContext<UserData>({} as UserData)
function UserProvider({children}: any) {
  const [user, setUser] = useState<IUser | null>(null);
  
  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
