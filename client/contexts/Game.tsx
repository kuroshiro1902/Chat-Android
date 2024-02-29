import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Socket, io } from "socket.io-client";
import { UserContext } from "./User";
import { server } from "../environments";
import { IRoom } from "../models/room.model";
import { IUser } from "../models/user.model";
import { Move } from "chess.js";
import axios from "axios";

export interface GameData {
  client: Socket | null,
  opponent: IUser | null,
  readyPlayers: {self: boolean, opponent: boolean},
  isStarted: boolean,
  hostId: string,
  playerColor: 'b' | 'w',
  isTurn: boolean,
  currentMove: Move | null,
  history: Move[],
  endStatus: 'win' | 'loss' | 'draw' | null,
  joinRoom: (roomId?: string) => void,
  leaveRoom: () => void,
  ready: () => void,
  unready: () => void,
  start: () => void,
  end: (status: 'win' | 'draw') => void,
  move: (move: Move) => void,
}
export const GameContext = createContext<GameData>({} as GameData)
function GameProvider({children, navigation}: any) {
  const {user, setUser, token} = useContext(UserContext);
  const [client, setClient] = useState<Socket | null>(null);
  const [opponent, setOpponent] = useState<IUser | null>(null);
  const [hostId, setHostId] = useState('');
  const [readyPlayers, setReadyPlayers] = useState<{self: boolean, opponent: boolean}>({self: false, opponent: false});
  const [isStarted, setIsStarted] = useState(false);
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [isTurn, setIsTurn] = useState(false);
  const [currentMove, setCurrentMove] = useState<Move | null>(null);
  const [history, setHistory] = useState<Move[]>([]);
  const [endStatus, setEndStatus] = useState<'win' | 'draw' | 'loss' | null>(null);

  const updateUserWhenEndGame = useCallback(async (matchStatus: 'win' | 'draw' | 'loss') => {
    const { data } = await axios.patch<{data: IUser}>(server.url + `/users/${user?.id}`, {matchStatus});
    AsyncStorage.setItem('user', JSON.stringify(data.data));
    setUser(data.data);
  }, [user]);

  const joinRoom = useCallback((roomId?: string) => {
    client?.emit('join-room', roomId);
  }, [client]);

  const leaveRoom = useCallback(() => {
    navigation.navigate('Home');
    //reset lại hết data khi rời room
    setOpponent(null);
    setHostId('');
    setReadyPlayers({self: false, opponent: false});
    setIsStarted(false);
    client?.emit('leave-room');
  }, []);

  const ready = useCallback(() => {
    client?.emit('ready');
  }, [client]);

  const unready = useCallback(() => {
    client?.emit('unready');
  }, [client]);
  
  const start = useCallback(() => {
    client?.emit('start');
  }, [client]);

  const end = useCallback((status: 'win' | 'draw') => {
    client?.emit('end', status);
  }, [client]);

  const move = useCallback((move: Move) => {
    client?.emit('move', move);
  }, [client]);

  const reset = useCallback(() => {
    client?.emit('reset');
  }, [client]);

  const gameEvents = useMemo<{[key: string]: (...args: any[]) => void }>(() => ({
    'joined-room': async (data: IRoom & {opponent: IUser}) => {
      setOpponent(_=>data.opponent);
      navigation.navigate('Room', {roomId: data.id});
    },
    'opponent-joined-room': async (data: IRoom & {opponent: IUser}) => {
      setOpponent(data.opponent);
      setHostId(data.hostId);
    },
    'opponent-left-room': () => {
      setOpponent(null);
      setHostId('');
    },
    'ready': (readyPlayers: {self: boolean, opponent: boolean}) => {
      setReadyPlayers(readyPlayers);
    },
    'start': (color: 'b' | 'w') => {
      setIsStarted(true);
      setEndStatus(null);
      setHistory([]);
      setPlayerColor(color);
      if (color === 'w') {
        setIsTurn(true);
      }
    },
    'end': async (status: 'win' | 'draw' | 'loss') => {
      setEndStatus(status)
    },
    'move': async (move: Move) => {
      setCurrentMove(_=>move);
      setHistory(prev=>[...prev, move])
      setIsTurn(prev => !prev);
    },
    'reset': async () => {

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
      _client.on('end', async (status: 'win' | 'draw' | 'loss') => {
        const additionOpponentElo = status === 'loss' ? 20 : (status === 'win'? -20 : 0);
        updateUserWhenEndGame(status);
        setEndStatus(status);
        setOpponent(prev=>{
          if(prev) return {...prev, elo: prev.elo + additionOpponentElo};
          return prev;
        })
      })
      return _client;
    });
    // return () => {
    //   _client?.close();
    // }
  },[user, token]);
  return ( 
    <GameContext.Provider 
      value={{
        client, opponent, hostId, readyPlayers, isTurn, isStarted, playerColor, currentMove, history, endStatus,
        joinRoom, leaveRoom, ready, unready, start, end, move
      }}>
      {children}
    </GameContext.Provider>
  );
}

export default GameProvider;