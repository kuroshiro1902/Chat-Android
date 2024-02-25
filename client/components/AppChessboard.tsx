import { memo, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Chessboard, { ChessboardRef } from "react-native-chessboard";
import { color } from "../theme";
import WhiteText from "./WhiteText";

interface props {
  isStarted: boolean,
  isReady: boolean,
  handleReady: () => void,
  handleStartCb: () => {
    canStart: boolean;
    handleStart: () => void;
  }
}
function AppChessboard({isStarted, isReady, handleReady, handleStartCb}: props) {
  const chessboardRef = useRef<ChessboardRef>(null);
  const {canStart, handleStart} = handleStartCb();
  return ( 
    <View style={styles.container}>
      {!isStarted && <View style={styles.overlay}>
        <Pressable style={styles.readyBtn} onPress={handleReady}>
          <WhiteText style={{fontSize: 24}}>{isReady ? 'Không sẵn sàng' : 'Sẵn sàng'}</WhiteText>
        </Pressable>
        {canStart &&
          <Pressable style={styles.startBtn} onPress={handleStart}>
            <WhiteText style={{fontSize: 26}}>Bắt đầu</WhiteText>
          </Pressable>
        }
      </View>}
      <Chessboard onMove={(info)=> console.log(info.move)} ref={chessboardRef} boardSize={window.innerWidth}/>
    </View>
   );
}

export default memo(AppChessboard);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0, right: 0,
    zIndex: 1,
    backgroundColor: '#33333345',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  readyBtn: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: color.green,
    borderWidth: 2,
    borderColor: color.blue
  },
  startBtn: {
    marginTop: 4,
    padding: 6,
    borderRadius: 4,
    backgroundColor: color.orange,
    borderWidth: 2,
    borderColor: color.blue
  }
});