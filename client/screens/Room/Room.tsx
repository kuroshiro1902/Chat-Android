import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color } from '../../theme';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Clipboard from '@react-native-clipboard/clipboard';
import AppChessboard from '../../components/AppChessboard';
import WhiteText from '../../components/WhiteText';
import { styles } from './styles';
import BottomMenuBtn from './BottomMenuBtn';
import PlayerStat from './PlayerStat';
import { GameContext } from '../../contexts/Game';
import { UserContext } from '../../contexts/User';

interface IBottomMenuOpt {
  message: string;
  handler: (...args: any[]) => void;
}

function TextMove({children, isBlack}: {children: string, isBlack?: boolean}){
  return (
    <Text style={{color: isBlack ? '#000' : '#fff', marginRight: 6, fontSize: 18}}>{children}</Text>
  )
}

const test: any[] = [];
for(let i = 0; i < 20; i++){test.push(<TextMove key={i}>{'h'+i}</TextMove>)}

function Room({navigation}: any) {
  const route = useRoute();
  const { roomId } = route.params as any;

  const {user} = useContext(UserContext);
  const {
    opponent, readyPlayers, isStarted, hostId, playerColor, isTurn, currentMove,
    leaveRoom, ready, unready, start, move
  } = useContext(GameContext);

  const [iconName, setIconName] = useState('copy');
  const historyViewRef = useRef<any>();

  const [isReady, setIsReady] = useState(false);
  const [evaluationValue, setEvaluationValue] = useState(0);

  const bottomMenuOpts: {[key: string]: IBottomMenuOpt} = useMemo(()=>({
    leave: {
      message: 'Bạn sẽ bị tính là thua cuộc, xác nhận rời phòng đấu?',
      handler: ()=>leaveRoom()
    },
    resign: {message: 'Xác nhận đầu hàng?', handler: ()=>{}},
  }), []) 
  const [submitHandler, setSubmitHandler] = useState<IBottomMenuOpt | null>(null);

  const copyToClipboard = useCallback(() => {
    Clipboard.setString(roomId);
    setIconName('check');
    setTimeout(() => setIconName('copy'), 1500);
  }, []);

  const handleReady = () => {
    if(readyPlayers.self){
      setIsReady(false);
      unready();
      return;
    }
    if(!readyPlayers.self){
      setIsReady(true)
      ready();
    }
  }

  const handleStartCb: () => {canStart: boolean, handleStart: ()=> void} = () => {
    if(readyPlayers.self && readyPlayers.opponent && hostId === ''+user?.id){
      return {canStart: true, handleStart: start}
    }
    else return {canStart: false, handleStart: ()=>{}}
  }

  useEffect(() => {
    // console.clear();
  }, []);

  return (
    <>
    {submitHandler && <View style={{...styles.submitCtn, }}>
      <View style={styles.submitForm}>
        <WhiteText style={{fontSize: 20, textAlign: 'center'}}>{submitHandler.message}</WhiteText>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 16}}>
          <Pressable style={{backgroundColor: color.orange, padding: 4, borderRadius: 4}} onPress={submitHandler.handler}>
            <Text style={{fontSize: 18, color: color.darkGreen, minWidth: 60, textAlign: 'center'}}>Xác nhận</Text>
          </Pressable>
          <Pressable style={{backgroundColor: color.gray, padding: 4, borderRadius: 4}} onPress={()=>{setSubmitHandler(null)}}>
            <Text style={{fontSize: 18, color: color.darkGreen, minWidth: 60, textAlign: 'center'}}>Hủy</Text>
          </Pressable>
        </View>
      </View>
    </View>}
    <View style={styles.container}>
      <View style={styles.roomHeader}>
        <Text style={{ color: color.white }}>Room id: </Text>
        <Text style={styles.roomId}>{roomId}</Text>
        <Pressable onPress={copyToClipboard}>
          <View style={styles.copyIdBtn}>
            <FeatherIcon name={iconName} size={16} color="#FFF" />
          </View>
        </Pressable>
      </View>
      <View id='setting' style={{margin: 8}}>
        <Text>Thời gian mỗi lượt: <Text style={{fontWeight: '500', color: color.darkGreen}}>30s</Text></Text>
        <Text>Trò chuyện: <Text style={{fontWeight: '500', color: color.darkGreen}}>Bật</Text></Text>
      </View>
      {/* <View>
        <Text>
          <Text style={{color: color.orange, textAlign: 'center', fontSize: 18}}>{playerReadyCount}</Text>/2 ready
        </Text>
      </View> */}
      <View id='history'>
        <ScrollView
          horizontal
          ref={historyViewRef}
          style={{marginVertical: 8, paddingHorizontal: 6, backgroundColor: color.green, height: 28}}
          onContentSizeChange={(e) => historyViewRef.current.scrollToEnd({animated: true})}
        >
          {test}
        </ScrollView>
      </View>
      <View id='main' style={styles.main}>
        <View id='chessboard'>
          <AppChessboard
            move={currentMove}
            isStarted={isStarted}
            isReady={isReady}
            handleReady={handleReady}
            handleStartCb={handleStartCb}
            playerColor={playerColor}
            isTurn={isTurn}
            handleMove={move}
          />
          {isStarted && 
            <View style={{marginTop: 6}}>
              {isTurn && <Text style={{color: color.green, fontSize: 20, textAlign: 'center'}}>Lượt của bạn!</Text>}
              {!isTurn && <Text style={{color: color.gray, fontSize: 20, textAlign: 'center'}}>Lượt đối thủ</Text>}
            </View>
          }
        </View>
        <View id='progress' style={{padding: 4}}>
          <View style={{borderRadius: 4, overflow: 'hidden', backgroundColor: color.gray, width: '100%', height: 24}}>
            <View style={{backgroundColor: color.blue, height: '100%', width: `${((-evaluationValue + 2000) / 4000) * 100}%`}}></View>
          </View>
          <Text style={{textAlign: 'center', marginTop: 8}}>Lợi thế: 100</Text>
        </View>
      </View>
      <View id='player-stats' style={{display: 'flex', flexDirection:'row', justifyContent: 'space-between', gap: 4}}>
          <PlayerStat player={user} ready={readyPlayers.self} />
          {opponent && <PlayerStat player={opponent} right ready={readyPlayers.opponent} />}
      </View>
      <View style={styles.bottomMenu}>
        <BottomMenuBtn title='Rời' iconName='log-out' onPress={()=>setSubmitHandler(bottomMenuOpts.leave)} />
        <BottomMenuBtn title='Đầu hàng' iconName='flag' onPress={()=>setSubmitHandler(bottomMenuOpts.resign)}/>
      </View>
    </View>
    </>
  );
}

export default Room;
