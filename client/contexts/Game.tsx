import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Socket, io } from "socket.io-client";
import { UserContext } from "./User";
import { server } from "../environments";
import { useNavigation } from "@react-navigation/native";
import { IRoom } from "../models/room.model";

export interface GameData {
  client: Socket | null,
  joinRoom: (roomId?: string) => void
}
export const GameContext = createContext<GameData>({} as GameData)
function GameProvider({children, navigation}: any) {
  const {user, token} = useContext(UserContext)
  const [client, setClient] = useState<Socket | null>(null);
  const depList = [user, token, client];

  const joinRoom = (roomId?: string) => {
    client?.emit('join-room', roomId);
  }

  const gameEvents = useMemo<{[key: string]: (...args: any[]) => void }>(() => ({
    'joined-room': (room: IRoom) => {
      navigation.navigate('Room', {roomId: room.id});
    }
  }), depList);

  const addEventListeners = useCallback((client: Socket) => {
    client.on('connect', ()=>{
      console.log('Connect to server!');
    });
    client.on('disconnect', ()=>{
      console.log('Disconnect to server!');
    });
    client.on('connect_error', ()=>{
      console.log('Connect error!');
    });
    Object.keys(gameEvents).forEach(key =>{
      client.on(key, gameEvents[key]);
    });
  }, depList);
  useEffect(()=>{
    let _client: Socket;
    if(user && token) setClient(() => {
      _client = io(server.url+`/game?playerId=${user.id ?? ''}`, {autoConnect: false, auth: {token}});
      _client?.connect();
      addEventListeners(_client);
      return _client;
    });
    return () => {
      _client?.close();
    }
  },[user, token]);
  return ( 
    <GameContext.Provider value={{client, joinRoom}}>
      {children}
    </GameContext.Provider>
  );
}

export default GameProvider;