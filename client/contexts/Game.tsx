import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Socket, io } from "socket.io-client";
import { UserContext } from "./User";
import { server } from "../environments";
import { IRoom } from "../models/room.model";
import { IUser } from "../models/user.model";
import axios from "axios";

export interface GameData {
  
}
export const GameContext = createContext<GameData>({})
function GameProvider({children, navigation}: any) {
  const {user, setUser, token} = useContext(UserContext);
  const [client, setClient] = useState<Socket | null>(null);
  
  const reset = useCallback(() => {
    client?.emit('reset');
  }, [client]);

  const gameEvents = useMemo<{[key: string]: (...args: any[]) => void }>(() => ({
    'joined-room': async (data: IRoom & {opponent: IUser}) => {
     
    }
    
  }), []);

  const addEventListeners = useCallback((client: Socket) => {
    client.on('connect', ()=>{
      console.log('Connect to server!');
    });
    client.on('disconnect', ()=>{
      console.log('Disconnect to server!');
    });
    client.on('connect_error', (err)=>{
      console.log('Connect error!');
      console.log(err);
      
    });
    Object.keys(gameEvents).forEach(key =>{
      client.on(key, gameEvents[key]);
    });
  }, []);
  useEffect(()=>{
    let _client: Socket;
    if(user && token && !client) setClient(() => {
      _client = io(server.url+`/game?playerId=${user.id ?? ''}`, {autoConnect: false, auth: {token}});
      _client?.connect();
      addEventListeners(_client);
 
      return _client;
    });
    // return () => {
    //   _client?.close();
    // }
  },[user, token]);
  return ( 
    <GameContext.Provider 
      value={{
       
      }}>
      {children}
    </GameContext.Provider>
  );
}

export default GameProvider;