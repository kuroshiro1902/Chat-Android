import { createContext, useState } from "react";
import { IUser } from "../models/user.model";

export interface UserData {
  user: IUser | null,
  token: string | null,
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>,
  setToken: React.Dispatch<React.SetStateAction<string | null>>
}
export const UserContext = createContext<UserData>({} as UserData)
function UserProvider({children}: any) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  return (
    <UserContext.Provider value={{user, token, setUser, setToken}}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;