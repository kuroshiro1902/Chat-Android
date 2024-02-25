import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Socket, io } from "socket.io-client";
import { UserContext } from "./User";
import { server } from "../environments";
import { IRoom } from "../models/room.model";
import { IUser } from "../models/user.model";
import axios from "axios";

export interface GameData {
  client: Socket | null,
  opponent: IUser | null,
  readyPlayers: {self: boolean, opponent: boolean},
  joinRoom: (roomId?: string) => void,
  leaveRoom: () => void,
  ready: () => void
}
export const GameContext = createContext<GameData>({} as GameData)
function GameProvider({children, navigation}: any) {
  const {user, token} = useContext(UserContext)
  const [client, setClient] = useState<Socket | null>(null);
  const [opponent, setOpponent] = useState<IUser | null>(null);
  const [readyPlayers, setReadyPlayers] = useState<{self: boolean, opponent: boolean}>({self: false, opponent: false});

  const joinRoom = (roomId?: string) => {
    client?.emit('join-room', roomId);
  }

  const leaveRoom = () => {
    navigation.navigate('Home');
    setOpponent(null);
    client?.emit('leave-room');
  }

  const ready = () => {
    client?.emit('ready');
  }

  const gameEvents = useMemo<{[key: string]: (...args: any[]) => void }>(() => ({
    'joined-room': async (data: IRoom & {opponent: IUser}) => {
      // if(data.playerIds.length > 1){
        // const opponentId = data.playerIds.filter((id)=> id !== ''+user?.id)[0];
        // const _opponent: IUser = (await axios.get(server.url + `/users?id=${opponentId}`)).data.data;
        setOpponent(_=>data.opponent);
      // }
      navigation.navigate('Room', {roomId: data.id});
    },
    'opponent-joined-room': async (data: IRoom & {opponent: IUser}) => {
      // const _opponent: IUser = (await axios.get(server.url + `/users?id=${data.playerId}`)).data.data;
      setOpponent(_=>data.opponent);
    },
    'opponent-left-room': () => {
      setOpponent(_=>null);
    },
    'ready': (readyPlayers: {self: boolean, opponent: boolean}) => {
      setReadyPlayers(_=>(readyPlayers));
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
    <GameContext.Provider value={{client, opponent, readyPlayers, joinRoom, leaveRoom, ready}}>
      {children}
    </GameContext.Provider>
  );
}

export default GameProvider;